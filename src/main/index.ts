import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, dialog, ipcMain, Menu, shell, Tray } from 'electron'
import path, { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { ActivityMonitor } from './services/activity-monitor'
import { GitTracker } from './services/git-tracker'
import { InactivityDetector } from './services/inactivity-detector'
import { ServerSync } from './services/server-sync'
import { DataStore } from './services/data-store'
import fs from 'fs'

// Global references
let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let activityMonitor: ActivityMonitor
let gitTracker: GitTracker
let dataStore: DataStore
let inactivityDetector: InactivityDetector
let serverSync: ServerSync

// Configuration
const CONFIG = {
  inactivityThreshold: 2 * 60 * 1000, // 2 minutes in milliseconds
  gitPollInterval: 1000 // 1 minute
}

async function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Initialize services
  dataStore = new DataStore()
  await dataStore.initialize()

  activityMonitor = new ActivityMonitor(dataStore)
  gitTracker = new GitTracker(dataStore, CONFIG.gitPollInterval)
  inactivityDetector = new InactivityDetector(CONFIG.inactivityThreshold)

  // Start tracking
  await activityMonitor.start()
  await gitTracker.start()
  inactivityDetector.start()

  // Handle inactivity events
  inactivityDetector.on('inactive', () => {
    activityMonitor.pause()
    mainWindow?.webContents.send('tracking-status', { active: false })
  })

  inactivityDetector.on('active', () => {
    activityMonitor.resume()
    mainWindow?.webContents.send('tracking-status', { active: true })
  })

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  // IPC handlers
  ipcMain.handle('get-current-activity', async () => {
    return activityMonitor.getCurrentActivity()
  })

  ipcMain.handle('get-resent-activities', async () => {
    return activityMonitor.getResentActivities()
  })

  ipcMain.handle('get-all-git-data', async () => {
    return dataStore.getAllGitData()
  })

  ipcMain.handle('get-daily-summary', async () => {
    return dataStore.getDailySummary()
  })

  ipcMain.handle('get-weekly-summary', async () => {
    return dataStore.getWeeklySummary()
  })

  ipcMain.handle('get-projects', async () => {
    return dataStore.getProjects()
  })

  ipcMain.handle('add-project', async (_, name: string, path?: string, gitUrl?: string) => {
    return dataStore.addProject(name, path, gitUrl)
  })

  ipcMain.handle('register-git-project', async (_, path: string, name: string) => {
    return gitTracker.registerProject(path, name)
  })

  ipcMain.handle('unregister-project', async (_, projectId: number) => {
    return gitTracker.unregisterProject(projectId)
  })

  // Add dialog handler for directory selection
  ipcMain.handle('select-directory', async () => {
    if (!mainWindow) return null

    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Select Project Directory'
    })

    if (result.canceled) return null
    return result.filePaths[0]
  })

  serverSync = ServerSync.getInstance()
  // Only start sync if both environment variables are set
  if (process.env.TIME_TRACKER_SERVER_URL && process.env.TIME_TRACKER_USER_ID) {
    serverSync.updateConfig({
      serverUrl: process.env.TIME_TRACKER_SERVER_URL,
      userId: process.env.TIME_TRACKER_USER_ID,
      syncEnabled: true
    })
    serverSync.startSync()
  }

  ipcMain.handle('get-sync-config', async () => {
    return serverSync.getConfig()
  })

  ipcMain.handle('update-sync-config', async (_, config) => {
    serverSync.updateConfig(config)
    return serverSync.getConfig()
  })

  ipcMain.handle('sync-now', async () => {
    return serverSync.syncData()
  })
}

function createTray() {
  // Try to use the tray icon, fallback to default icon if not found
  let trayIconPath: string
  try {
    trayIconPath = path.join(__dirname, '../assets/tray-icon.png')
    if (!fs.existsSync(trayIconPath)) {
      // Fallback to the main app icon
      trayIconPath = icon
    }
  } catch (error) {
    console.warn('Could not find tray icon, using default:', error)
    trayIconPath = icon
  }

  tray = new Tray(trayIconPath)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Dashboard',
      click: () => mainWindow?.show()
    },
    {
      label: 'Pause Tracking',
      click: () => {
        activityMonitor.pause()
        mainWindow?.webContents.send('tracking-status', { active: false })
      }
    },
    {
      label: 'Resume Tracking',
      click: () => {
        activityMonitor.resume()
        mainWindow?.webContents.send('tracking-status', { active: true })
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => app.quit()
    }
  ])

  tray.setToolTip('Time Tracker')
  tray.setContextMenu(contextMenu)

  // Show current activity in tray tooltip
  setInterval(async () => {
    const activity = await activityMonitor.getCurrentActivity()
    if (activity) {
      tray?.setToolTip(`${activity.app} - ${activity.title.substring(0, 30)}`)
    }
  }, 500)
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()
  createTray()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', async () => {
  // Clean up services
  activityMonitor.stop()
  gitTracker.stop()
  inactivityDetector.stop()
  serverSync.stopSync()

  // Close database connection
  await dataStore.close()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

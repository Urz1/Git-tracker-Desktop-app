import { exec } from 'child_process'
import { EventEmitter } from 'events'
import { promisify } from 'util'
import type { DataStore } from './data-store'

const execAsync = promisify(exec)

interface Activity {
  timestamp: number
  app: string
  title: string
  url?: string
  file?: string
  projectId?: number
  activityType: 'coding' | 'browsing' | 'other'
}

export class ActivityMonitor extends EventEmitter {
  private interval: NodeJS.Timeout | null = null
  private currentActivity: Activity | null = null
  private pollInterval = 5000
  private isTracking = true
  private lastInputTimestamp = Date.now()
  private lastWindowChangeTimestamp = Date.now()

  constructor(private dataStore: DataStore) {
    super()
    this.pollInputActivity()
  }

  // Polling method to track window focus (simple idle detection)
  private pollInputActivity() {
    setInterval(() => {
      this.checkForWindowFocusChange()
    }, this.pollInterval)
  }

  // Function to check if the active window has changed, implying user activity
  private checkForWindowFocusChange() {
    this.getActiveWindow()
      .then((win) => {
        if (win) {
          const currentTime = Date.now()

          if (this.lastWindowChangeTimestamp === 0 || win.title !== this.currentActivity?.title) {
            this.lastInputTimestamp = currentTime
            this.lastWindowChangeTimestamp = currentTime
          }
        }
      })
      .catch((error) => {
        console.error('Error while checking window focus:', error)
      })
  }

  private getIdleTime(): number {
    // The idle time is the time passed since the last input activity (based on window focus)
    return Date.now() - this.lastInputTimestamp
  }

  async start() {
    this.interval = setInterval(async () => {
      if (!this.isTracking) return

      const idleTime = this.getIdleTime()
      if (idleTime > 1000 * 60 * 10) {
        // If idle for more than 10 minutes, skip activity logging
        console.log('User is idle. Skipping activity logging.')
        return
      }

      try {
        const win = await this.getActiveWindow()
        if (!win) return

        const { app, title } = win

        let activityType: 'coding' | 'browsing' | 'other' = 'other'
        let file: string | undefined
        let url: string | undefined
        let projectId: number | undefined

        if (/Code|Visual Studio/i.test(app)) {
          activityType = 'coding'
          file = this.extractFileFromTitle(title)
        } else if (/Chrome|Firefox|Safari|Edge/i.test(app)) {
          activityType = 'browsing'
          url = await this.extractUrlFromBrowser(app)
        }

        const activity: Activity = {
          timestamp: Date.now(),
          app,
          title,
          url,
          file,
          projectId,
          activityType
        }

        console.log({ activity })

        const projectChanged = this.currentActivity?.projectId !== activity.projectId

        this.currentActivity = activity
        await this.dataStore.addActivity(activity)

        this.emit('activity', activity)
        if (projectChanged) {
          this.emit('project-changed', activity.projectId)
        }
      } catch (error) {
        console.error('Error tracking activity:', error)
      }
    }, this.pollInterval)

    console.log('Activity monitor started')
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    console.log('Activity monitor stopped')
  }

  pause() {
    this.isTracking = false
    console.log('Activity tracking paused')
  }

  resume() {
    this.isTracking = true
    console.log('Activity tracking resumed')
  }

  getCurrentActivity(): Activity | null {
    return this.currentActivity
  }

  getResentActivities(): Promise<Activity[]> {
    return this.dataStore.getRecentActivities()
  }

  private async getActiveWindow(): Promise<{
    app: string
    title: string
    filePath?: string
  } | null> {
    try {
      let app = ''
      let title = ''

      // Detect the platform and get the active window accordingly
      if (process.platform === 'darwin') {
        // macOS (using AppleScript)
        const script = `
          tell application "System Events"
            set frontApp to name of the first application process whose frontmost is true
            set frontTitle to name of the first window of the front application
          end tell
        `
        const { stdout } = await execAsync(`osascript -e '${script}'`)
        const result = stdout.trim().split('\n')
        app = result[0]
        title = result.slice(1).join('\n')
      } else if (process.platform === 'win32') {
        // Windows (using PowerShell)
        const { stdout } = await execAsync(
          'powershell Get-Process | Where-Object {$_.MainWindowHandle -ne 0} | Select-Object -First 1'
        )
        app = stdout.trim().split('\n')[0]
        title = stdout.trim().split('\n')[1] // Assuming the window title is in the second line
      } else if (process.platform === 'linux') {
        // Linux (using xdotool or wmctrl)
        const { stdout } = await execAsync('xdotool getactivewindow getwindowname')
        title = stdout.trim()
        app = 'Unknown App' // No easy way to get app name on Linux without external tools
      }

      return { app, title }
    } catch (error) {
      console.error('Error getting active window:', error)
      return null
    }
  }

  private extractFileFromTitle(title: string): string | undefined {
    const match = title.match(/^(.+?)\s*[—-]/)
    return match ? match[1].trim() : undefined
  }

  private async extractUrlFromBrowser(app: string): Promise<string | undefined> {
    if (process.platform !== 'darwin') return undefined

    const browserScriptMap: Record<string, string> = {
      'Google Chrome': `
        tell application "Google Chrome"
          return URL of active tab of front window
        end tell
      `,
      Firefox: `
        tell application "Firefox"
          return URL of active tab of front window
        end tell
      `,
      Safari: `
        tell application "Safari"
          return URL of current tab of front window
        end tell
      `,
      'Microsoft Edge': `
        tell application "Microsoft Edge"
          return URL of active tab of front window
        end tell
      `
    }

    const script = browserScriptMap[app]
    if (!script) return undefined

    try {
      const { stdout } = await execAsync(`osascript -e '${script}'`)
      return stdout.trim()
    } catch (error) {
      console.error(`URL extract failed for ${app}:`, error)
      return undefined
    }
  }
}

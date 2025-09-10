import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getResentActivities: () => ipcRenderer.invoke('get-resent-activities'),
  // getAllGitData: () => ipcRenderer.invoke('get-all-git-data'),
  getCurrentActivity: () => ipcRenderer.invoke('get-current-activity'),
  getDailySummary: () => ipcRenderer.invoke('get-daily-summary'),
  getWeeklySummary: () => ipcRenderer.invoke('get-weekly-summary'),
  getProjects: () => ipcRenderer.invoke('get-projects'),
  addProject: (name: string, path?: string, gitUrl?: string) =>
    ipcRenderer.invoke('add-project', name, path, gitUrl),
  registerGitProject: (path: string, name: string) =>
    ipcRenderer.invoke('register-git-project', path, name),
  unregisterProject: (projectId: number) => ipcRenderer.invoke('unregister-project', projectId),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  onTrackingStatus: (callback: (status: { active: boolean }) => void) => {
    ipcRenderer.on('tracking-status', (_event, status) => callback(status))
    return () => {
      ipcRenderer.removeAllListeners('tracking-status')
    }
  }
}

export type Api = typeof api

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

import { DBManager } from './db-manager'

interface Activity {
  timestamp: number
  app: string
  title: string
  url?: string
  file?: string
  projectId?: number
  activityType: 'coding' | 'browsing' | 'other'
}

interface GitData {
  name: string
  branch: string
  commit: string
  message: string
  isDirty: boolean
  inserted: number
  deleted: number
  changed: number
}

interface BrowserActivity {
  timestamp: number
  browser: string
  url: string
  title: string
  domain: string
  path: string
  projectId?: number
}

export class DataStore {
  private dbManager: DBManager

  constructor() {
    this.dbManager = DBManager.getInstance()
  }

  async initialize(): Promise<void> {
    await this.dbManager.initialize()
  }

  async addActivity(activity: Activity): Promise<void> {
    try {
      // First, check if the application exists
      let applicationId: number | null = null

      const existingApp = this.dbManager.find('applications', (app: any) => app.name === activity.app)

      if (existingApp) {
        applicationId = existingApp.id
      } else {
        // Create new application
        const result = this.dbManager.insert('applications', {
          name: activity.app,
          process_name: activity.app
        })
        applicationId = (result as any).id || null
      }

      // Calculate duration based on previous entry
      let duration = 0
      if (activity.activityType === 'coding' || activity.activityType === 'browsing') {
        const lastEntry = this.dbManager.find('time_entries', (entry: any) => 
          entry.application_id === applicationId && entry.project_id === activity.projectId
        )

        if (lastEntry) {
          const lastTimestamp = new Date(lastEntry.start_time).getTime()
          duration = Math.min(activity.timestamp - lastTimestamp, 5 * 60 * 1000) // Cap at 5 minutes
        }
      }

      // Insert time entry
      this.dbManager.insert('time_entries', {
        project_id: activity.projectId || null,
        application_id: applicationId,
        start_time: new Date(activity.timestamp).toISOString(),
        duration_seconds: Math.floor(duration / 1000),
        activity_type: activity.activityType,
        file_path: activity.file || null,
        url: activity.url || null,
        title: activity.title
      })
    } catch (error) {
      console.error('Error adding activity:', error)
    }
  }

  async addBrowserActivity(activity: BrowserActivity): Promise<void> {
    try {
      // Calculate duration based on previous entry
      let duration = 0
      const lastEntry = this.dbManager.find('browser_activities', (entry: any) => 
        entry.browser === activity.browser && entry.domain === activity.domain
      )

      if (lastEntry) {
        const lastTimestamp = new Date(lastEntry.start_time).getTime()
        duration = Math.min(activity.timestamp - lastTimestamp, 5 * 60 * 1000) // Cap at 5 minutes
      }

      // Insert browser activity
      this.dbManager.insert('browser_activities', {
        project_id: activity.projectId || null,
        browser: activity.browser,
        url: activity.url,
        domain: activity.domain,
        path: activity.path,
        title: activity.title,
        start_time: new Date(activity.timestamp).toISOString(),
        duration_seconds: Math.floor(duration / 1000)
      })
    } catch (error) {
      console.error('Error adding browser activity:', error)
    }
  }

  async updateGitData(projectId: number, gitData: GitData): Promise<void> {
    try {
      // Insert git commit
      this.dbManager.insert('git_commits', {
        project_id: projectId,
        hash: gitData.commit,
        branch: gitData.branch,
        message: gitData.message,
        commit_time: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating git data:', error)
    }
  }

  async getDailySummary(): Promise<Record<string, number>> {
    const summary: Record<string, number> = {}

    try {
      // Today at midnight
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayISO = today.toISOString()

      // Get time entries for today
      const timeEntries = this.dbManager.filter('time_entries', (entry: any) => 
        new Date(entry.start_time) >= today
      )

      for (const entry of timeEntries) {
        const key = entry.title || 'Unknown'
        summary[key] = (summary[key] || 0) + (entry.duration_seconds || 0)
      }

      // Get browser activities for today
      const browserActivities = this.dbManager.filter('browser_activities', (entry: any) => 
        new Date(entry.start_time) >= today
      )

      for (const entry of browserActivities) {
        const key = entry.domain || 'Unknown Website'
        summary[key] = (summary[key] || 0) + (entry.duration_seconds || 0)
      }

      return summary
    } catch (error) {
      console.error('Error getting daily summary:', error)
      return {}
    }
  }

  async getWeeklySummary(): Promise<Record<string, number>> {
    const summary: Record<string, number> = {}

    try {
      // Get date 7 days ago
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      sevenDaysAgo.setHours(0, 0, 0, 0)

      // Get time entries for the week
      const timeEntries = this.dbManager.filter('time_entries', (entry: any) => 
        new Date(entry.start_time) >= sevenDaysAgo
      )

      for (const entry of timeEntries) {
        const key = entry.title || 'Unknown'
        summary[key] = (summary[key] || 0) + (entry.duration_seconds || 0)
      }

      // Get browser activities for the week
      const browserActivities = this.dbManager.filter('browser_activities', (entry: any) => 
        new Date(entry.start_time) >= sevenDaysAgo
      )

      for (const entry of browserActivities) {
        const key = entry.domain || 'Unknown Website'
        summary[key] = (summary[key] || 0) + (entry.duration_seconds || 0)
      }

      return summary
    } catch (error) {
      console.error('Error getting weekly summary:', error)
      return {}
    }
  }

  async getProjects(): Promise<any[]> {
    try {
      return this.dbManager.filter('projects', () => true)
    } catch (error) {
      console.error('Error getting projects:', error)
      return []
    }
  }

  async addProject(name: string, path?: string, gitUrl?: string): Promise<number | null> {
    try {
      const result = this.dbManager.insert('projects', {
        name,
        path: path || null,
        git_url: gitUrl || null
      })
      return (result as any).id || null
    } catch (error) {
      console.error('Error adding project:', error)
      return null
    }
  }

  async deleteProject(projectId: number): Promise<void> {
    try {
      this.dbManager.delete('projects', projectId)
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  async getCurrentActivity(): Promise<any | null> {
    try {
      // Get the most recent time entry
      const entries = this.dbManager.filter('time_entries', () => true)
      if (entries.length === 0) return null

      const entry = entries.sort((a: any, b: any) => 
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
      )[0]

      return {
        app: entry.app_name || 'Unknown',
        project: entry.project_name || 'Unknown',
        title: entry.title,
        file: entry.file_path,
        url: entry.url,
        activityType: entry.activity_type,
        timestamp: new Date(entry.start_time).getTime()
      }
    } catch (error) {
      console.error('Error getting current activity:', error)
      return null
    }
  }

  async getRecentActivities(limit: number = 20): Promise<Activity[]> {
    try {
      const timeEntries = this.dbManager.filter('time_entries', () => true)
        .sort((a: any, b: any) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
        .slice(0, limit)

      const browserActivities = this.dbManager.filter('browser_activities', () => true)
        .sort((a: any, b: any) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
        .slice(0, limit)

      const recentActivities = [
        ...timeEntries.map((entry: any) => ({
          timestamp: new Date(entry.start_time).getTime(),
          app: entry.app_name || 'Unknown App',
          title: entry.title,
          url: entry.url,
          file: entry.file_path,
          projectId: entry.project_id,
          activityType: entry.activity_type
        })),
        ...browserActivities.map((entry: any) => ({
          timestamp: new Date(entry.start_time).getTime(),
          app: 'Browser',
          title: entry.title,
          url: entry.url,
          file: undefined,
          projectId: entry.project_id,
          activityType: 'browsing' as const
        }))
      ]

      // Sort combined list by timestamp descending and return top N
      return recentActivities
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit)
    } catch (error) {
      console.error('Error getting recent activities:', error)
      return []
    }
  }

  async getAllGitData(limit: number = 20): Promise<GitData[]> {
    try {
      // Get git commits from the DBManager
      const gitCommits = this.dbManager.filter('git_commits', () => true)
        .sort((a: any, b: any) => new Date(b.commit_time || 0).getTime() - new Date(a.commit_time || 0).getTime())
        .slice(0, limit)

      // Map the result into a user-friendly format
      return gitCommits.map((commit: any) => ({
        name: commit.project_name || 'Unknown Project',
        branch: commit.branch || 'main',
        commit: commit.hash || commit.commit || 'unknown',
        message: commit.message || 'No message',
        isDirty: commit.is_dirty || false,
        inserted: commit.inserted || 0,
        deleted: commit.deleted || 0,
        changed: commit.changed || 0
      }))
    } catch (error) {
      console.error('Error getting all Git data:', error)
      return []
    }
  }

  async close(): Promise<void> {
    await this.dbManager.close()
  }
}

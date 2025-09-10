import { app } from "electron"
import path from "path"
import fs from "fs"
import { DBManager } from "./db-manager"

interface SyncConfig {
  serverUrl: string
  userId: string
  lastSyncTimestamp: number
  syncEnabled: boolean
}

export class ServerSync {
  private static instance: ServerSync
  private dbManager: DBManager
  private config: SyncConfig
  private configPath: string
  private syncInterval: NodeJS.Timeout | null = null

  private constructor() {
    this.dbManager = DBManager.getInstance()

    // Create config directory if it doesn't exist
    const configDir = path.join(app.getPath("userData"), "config")
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }

    this.configPath = path.join(configDir, "sync-config.json")
    this.config = this.loadConfig()
  }

  public static getInstance(): ServerSync {
    if (!ServerSync.instance) {
      ServerSync.instance = new ServerSync()
    }
    return ServerSync.instance
  }

  private loadConfig(): SyncConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, "utf8")
        return JSON.parse(data)
      }
    } catch (error) {
      console.error("Error loading sync config:", error)
    }

    // Default config
    return {
      serverUrl: process.env.TIME_TRACKER_SERVER_URL || "",
      userId: process.env.TIME_TRACKER_USER_ID || "",
      lastSyncTimestamp: 0,
      syncEnabled: false,
    }
  }

  private saveConfig(): void {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2))
    } catch (error) {
      console.error("Error saving sync config:", error)
    }
  }

  public getConfig(): SyncConfig {
    return { ...this.config }
  }

  public updateConfig(config: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...config }
    this.saveConfig()

    // Restart sync if enabled
    if (this.config.syncEnabled) {
      this.stopSync()
      this.startSync()
    } else {
      this.stopSync()
    }
  }

  public startSync(intervalMinutes = 15): void {
    if (!this.config.serverUrl || !this.config.userId) {
      console.error("Server URL and User ID are required for sync")
      return
    }

    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }

    // Perform initial sync
    this.syncData()

    // Set up regular sync
    this.syncInterval = setInterval(
      () => {
        this.syncData()
      },
      intervalMinutes * 60 * 1000,
    )

    console.log(`Server sync started, interval: ${intervalMinutes} minutes`)
  }

  public stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
    console.log("Server sync stopped")
  }

  public async syncData(): Promise<boolean> {
    if (!this.config.syncEnabled || !this.config.serverUrl || !this.config.userId) {
      return false
    }

    try {
      console.log("Starting data sync...")
      const db = this.dbManager.getDb()

      // Get data since last sync
      const timeEntries = await db.all(
        `SELECT * FROM time_entries WHERE created_at > datetime(?, 'unixepoch')`,
        this.config.lastSyncTimestamp / 1000,
      )

      const browserActivities = await db.all(
        `SELECT * FROM browser_activities WHERE created_at > datetime(?, 'unixepoch')`,
        this.config.lastSyncTimestamp / 1000,
      )

      const gitCommits = await db.all(
        `SELECT * FROM git_commits WHERE created_at > datetime(?, 'unixepoch')`,
        this.config.lastSyncTimestamp / 1000,
      )

      // Prepare data for sync
      const syncData = {
        userId: this.config.userId,
        timeEntries,
        browserActivities,
        gitCommits,
        timestamp: Date.now(),
      }

      // Send data to server
      const response = await fetch(`${this.config.serverUrl}/api/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(syncData),
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
      }

      // Update last sync timestamp
      this.config.lastSyncTimestamp = Date.now()
      this.saveConfig()

      console.log("Data sync completed successfully")
      return true
    } catch (error) {
      console.error("Error syncing data:", error)
      return false
    }
  }
}

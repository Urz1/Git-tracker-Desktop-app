import fs from 'fs'
import os from 'os'
import path from 'path'

type TableName = 'applications' | 'projects' | 'git_commits' | 'time_entries' | 'browser_activities'

interface DatabaseSchema {
  applications: any[]
  projects: any[]
  git_commits: any[]
  time_entries: any[]
  browser_activities: any[]
}

export class DBManager {
  private static instance: DBManager
  private dbPath: string
  private data: DatabaseSchema

  private constructor() {
    const dataDir = path.join(os.homedir(), '.timetracker')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    this.dbPath = path.join(dataDir, 'db.json')
    this.data = this.loadData()
  }

  public static getInstance(): DBManager {
    if (!DBManager.instance) {
      DBManager.instance = new DBManager()
    }
    return DBManager.instance
  }

  private loadData(): DatabaseSchema {
    if (fs.existsSync(this.dbPath)) {
      try {
        const raw = fs.readFileSync(this.dbPath, 'utf-8')
        return JSON.parse(raw)
      } catch (err) {
        console.error('Failed to parse db.json:', err)
      }
    }

    const initialData: DatabaseSchema = {
      applications: [],
      projects: [],
      git_commits: [],
      time_entries: [],
      browser_activities: []
    }

    this.saveData(initialData)
    return initialData
  }

  private saveData(data: DatabaseSchema = this.data): void {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2))
  }

  // Simple CRUD methods
  public insert<T = any>(table: TableName, record: T): T {
    const id = Date.now()
    const newRecord = { id, ...record, created_at: new Date().toISOString() }
    this.data[table].push(newRecord)
    this.saveData()
    return newRecord
  }

  public find<T = any>(table: TableName, predicate: (record: T) => boolean): T | undefined {
    return this.data[table].find(predicate)
  }

  public filter<T = any>(table: TableName, predicate: (record: T) => boolean): T[] {
    return this.data[table].filter(predicate)
  }

  public update<T = any>(table: TableName, id: number, changes: Partial<T>): boolean {
    const record = this.data[table].find((r: any) => r.id === id)
    if (record) {
      Object.assign(record, changes, { updated_at: new Date().toISOString() })
      this.saveData()
      return true
    }
    return false
  }

  public delete(table: TableName, id: number): boolean {
    const index = this.data[table].findIndex((r: any) => r.id === id)
    if (index !== -1) {
      this.data[table].splice(index, 1)
      this.saveData()
      return true
    }
    return false
  }

  public checkHealth(): boolean {
    return fs.existsSync(this.dbPath)
  }

  public async initialize(): Promise<void> {
    // Initialize database - ensure data directory exists and load data
    const dataDir = path.dirname(this.dbPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    this.data = this.loadData()
  }

  public async close(): Promise<void> {
    this.saveData()
    console.info('Data saved and DB closed.')
  }
}

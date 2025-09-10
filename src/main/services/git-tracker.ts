import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import type { DataStore } from './data-store'

const execAsync = promisify(exec)

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
interface Project {
  id: number
  path: string
  name: string
}

export class GitTracker {
  private interval: NodeJS.Timeout | null = null
  private projects: Project[] = []

  constructor(
    private dataStore: DataStore,
    private pollInterval: number
  ) {}

  async start(): Promise<void> {
    await this.loadProjects()

    this.interval = setInterval(() => {
      this.pollProjects().catch((error) => console.error('Polling error:', error))
    }, this.pollInterval)

    console.log('Git tracker started')
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    console.log('Git tracker stopped')
  }

  private async pollProjects(): Promise<void> {
    for (const project of this.projects) {
      try {
        const gitData = await this.getGitData(project.path)
        if (gitData) {
          await this.dataStore.updateGitData(project.id, gitData)
        }
      } catch (error) {
        console.error(`Git error in project "${project.name}":`, error)
      }
    }
  }

  async registerProject(projectPath: string, projectName: string): Promise<boolean> {
    try {
      const isGit = await this.isGitRepository(projectPath)
      if (!isGit) {
        console.warn(`Not a Git repo: ${projectPath}`)
        return false
      }

      const projectId = await this.dataStore.addProject(projectName, projectPath)

      if (projectId) {
        this.projects.push({ id: projectId, path: projectPath, name: projectName })
        console.log(`Registered Git project: ${projectName}`)
        return true
      }

      return false
    } catch (error) {
      console.error('Error registering project:', error)
      return false
    }
  }

  async unregisterProject(projectId: number): Promise<boolean> {
    try {
      // Remove from in-memory list
      this.projects = this.projects.filter((p) => p.id !== projectId)

      // Remove from the database
      await this.dataStore.deleteProject(projectId)

      console.log(`Unregistered Git project ID: ${projectId}`)
      return true
    } catch (error) {
      console.error('Error unregistering project:', error)
      return false
    }
  }

  private async loadProjects(): Promise<void> {
    try {
      const projects = await this.dataStore.getProjects()
      this.projects = projects
        .filter((p) => p.path)
        .map((p) => ({
          id: p.id,
          path: p.path,
          name: p.name
        }))
    } catch (error) {
      console.error('Failed to load projects from datastore:', error)
      this.projects = []
    }
  }

  private async isGitRepository(dirPath: string): Promise<boolean> {
    try {
      const gitPath = path.join(dirPath, '.git')
      return fs.existsSync(gitPath) && fs.statSync(gitPath).isDirectory()
    } catch {
      return false
    }
  }

  private async getGitData(projectPath: string): Promise<GitData | null> {
    try {
      const branch = await this.execGit(projectPath, 'git rev-parse --abbrev-ref HEAD')
      const log = await this.execGit(projectPath, 'git log -1 --pretty=format:"%H|%s"')
      const name = path.basename(projectPath)

      const [commit, ...msgParts] = log.split('|')
      const message = msgParts.join('|').trim()

      if (!commit || !message) throw new Error('Invalid git log format')

      // Check if there are uncommitted changes
      const statusOutput = await this.execGit(projectPath, 'git status --porcelain')
      const isDirty = statusOutput.trim().length > 0

      // Get insertions and deletions from diff
      const diffOutput = await this.execGit(projectPath, 'git diff --shortstat')

      const insertedMatch = diffOutput.match(/(\d+) insertions?/)
      const deletedMatch = diffOutput.match(/(\d+) deletions?/)
      const changedMatch = diffOutput.match(/(\d+) files changed?/)

      const inserted = insertedMatch ? parseInt(insertedMatch[1]) : 0
      const deleted = deletedMatch ? parseInt(deletedMatch[1]) : 0
      const changed = changedMatch ? parseInt(changedMatch[1]) : 0

      return {
        name,
        branch,
        commit,
        message,
        isDirty,
        inserted,
        deleted,
        changed
      }
    } catch (error: any) {
      console.warn(`Failed to get git data in ${projectPath}:`, error?.message)
      return null
    }
  }

  getAllGitData(): Promise<GitData[]> {
    return this.dataStore.getAllGitData()
  }

  private async execGit(cwd: string, command: string): Promise<string> {
    const { stdout } = await execAsync(command, { cwd })
    return stdout.trim()
  }
}

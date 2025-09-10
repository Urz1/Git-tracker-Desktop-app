import { EventEmitter } from 'events'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class InactivityDetector extends EventEmitter {
  private interval: NodeJS.Timeout | null = null
  private isActive = true
  private checkInterval = 10000 // 10 seconds

  constructor(private inactivityThreshold: number) {
    super()
  }

  start(): void {
    this.interval = setInterval(async () => {
      try {
        const idleTime = await this.getIdleTime()

        if (idleTime > this.inactivityThreshold && this.isActive) {
          this.isActive = false
          this.emit('inactive')
        } else if (idleTime < this.inactivityThreshold && !this.isActive) {
          this.isActive = true
          this.emit('active')
        }
      } catch (error) {
        console.error('Error detecting inactivity:', error)
      }
    }, this.checkInterval)

    console.log('Inactivity detector started')
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    console.log('Inactivity detector stopped')
  }

  private async getIdleTime(): Promise<number> {
    // This implementation will vary by OS
    try {
      // For macOS:
      if (process.platform === 'darwin') {
        const script = `
          tell application "System Events"
            return idle time
          end tell
        `
        const { stdout } = await execAsync(`osascript -e '${script}'`)
        return Number.parseInt(stdout.trim(), 10) * 1000 // Convert to milliseconds
      }

      // For Windows (requires additional libraries):
      else if (process.platform === 'win32') {
        // Placeholder - would use a library
        return 0
      }

      // For Linux (requires additional libraries):
      else if (process.platform === 'linux') {
        // Placeholder - would use xprintidle or similar
        return 0
      }

      return 0
    } catch (error) {
      console.error('Error getting idle time:', error)
      return 0
    }
  }
}

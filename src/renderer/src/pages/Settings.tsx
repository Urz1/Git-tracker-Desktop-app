"use client"

import type React from "react"
import { useState, useEffect } from "react"

const Settings: React.FC = () => {
  const [startOnBoot, setStartOnBoot] = useState(false)
  const [inactivityThreshold, setInactivityThreshold] = useState(2)
  const [trackingEnabled, setTrackingEnabled] = useState(true)
  const [syncConfig] = useState<any>({
    serverUrl: "",
    userId: "",
    lastSyncTimestamp: 0,
    syncEnabled: false,
  })
  const [isSyncing, setIsSyncing] = useState(false)

  // These would be connected to actual settings in a real app
  const handleStartOnBootChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartOnBoot(e.target.checked)
  }

  const handleInactivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInactivityThreshold(Number(e.target.value))
  }

  const handleTrackingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingEnabled(e.target.checked)
  }

  useEffect(() => {
    const loadSyncConfig = async () => {
      try {
        // const config = await window.api.getSyncConfig()
        // setSyncConfig(config)
      } catch (error) {
        console.error("Error loading sync config:", error)
      }
    }

    loadSyncConfig()
  }, [])

  const handleSyncToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      e
      // const enabled = e.target.checked
      // const config = await window.api.updateSyncConfig({ syncEnabled: enabled })
      // setSyncConfig(config)
    } catch (error) {
      console.error("Error updating sync config:", error)
    }
  }

  const handleSyncNow = async () => {
    try {
      setIsSyncing(true)
      // await window.api.syncNow()
    } catch (error) {
      console.error("Error syncing data:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Configure your time tracking preferences</p>
      </header>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">General Settings</h2>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <h3 className="font-medium">Start on system boot</h3>
              <p className="text-sm text-gray-500">Automatically start Time Tracker when your computer starts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={startOnBoot}
                onChange={handleStartOnBootChange}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <h3 className="font-medium">Inactivity threshold</h3>
              <p className="text-sm text-gray-500">Time before tracking is paused due to inactivity</p>
            </div>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
              value={inactivityThreshold}
              onChange={handleInactivityChange}
            >
              <option value="1">1 minute</option>
              <option value="2">2 minutes</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium">Enable tracking</h3>
              <p className="text-sm text-gray-500">Turn time tracking on or off</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={trackingEnabled}
                onChange={handleTrackingChange}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Data Management</h2>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <h3 className="font-medium">Export data</h3>
              <p className="text-sm text-gray-500">Export your time tracking data as CSV</p>
            </div>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">Export</button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-red-600">Clear all data</h3>
              <p className="text-sm text-gray-500">Delete all your tracking data (cannot be undone)</p>
            </div>
            <button className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg">Clear Data</button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">About</h2>
          <p className="text-sm text-gray-600">Time Tracker v1.0.0</p>
          <p className="text-sm text-gray-500">A simple, privacy-focused time tracking application</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Server Synchronization</h2>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <h3 className="font-medium">Enable sync</h3>
              <p className="text-sm text-gray-500">Sync your time tracking data with the server</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={syncConfig.syncEnabled}
                onChange={handleSyncToggle}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <h3 className="font-medium">Server URL</h3>
              <p className="text-sm text-gray-500">{syncConfig.serverUrl || "Not configured"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <h3 className="font-medium">User ID</h3>
              <p className="text-sm text-gray-500">{syncConfig.userId || "Not configured"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium">Last synced</h3>
              <p className="text-sm text-gray-500">
                {syncConfig.lastSyncTimestamp ? new Date(syncConfig.lastSyncTimestamp).toLocaleString() : "Never"}
              </p>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              onClick={handleSyncNow}
              disabled={!syncConfig.syncEnabled || isSyncing}
            >
              {isSyncing ? "Syncing..." : "Sync Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

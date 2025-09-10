"use client"

import type React from "react"
import { useState } from "react"
import { FolderIcon } from "./Icons"

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (project: { name: string; path?: string; gitUrl?: string }) => void
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState("")
  const [path, setPath] = useState("")
  const [gitUrl, setGitUrl] = useState("")
  const [error, setError] = useState("")
  const [isSelectingDirectory, setIsSelectingDirectory] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Project name is required")
      return
    }

    onAdd({ name, path: path.trim() || undefined, gitUrl: gitUrl.trim() || undefined })

    // Reset form
    setName("")
    setPath("")
    setGitUrl("")
    setError("")
  }

  const handleSelectDirectory = async () => {
    try {
      setIsSelectingDirectory(true)
      const selectedPath = await window.api.selectDirectory()
      if (selectedPath) {
        setPath(selectedPath)
      }
    } catch (error) {
      console.error("Error selecting directory:", error)
    } finally {
      setIsSelectingDirectory(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Add New Project</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4">
            {error && <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-md text-sm">{error}</div>}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name*</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md text-gray-700"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Project"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Path</label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-l-md text-gray-700"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="/path/to/project"
                  readOnly
                />
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 px-3 rounded-r-md flex items-center"
                  onClick={handleSelectDirectory}
                  disabled={isSelectingDirectory}
                >
                  <FolderIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Local path to your project directory</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Git URL (optional)</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md text-gray-700"
                value={gitUrl}
                onChange={(e) => setGitUrl(e.target.value)}
                placeholder="https://github.com/username/repo.git"
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 flex justify-end space-x-2 rounded-b-lg">
            <button type="button" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md">
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProjectModal

"use client"

import type React from "react"
import { useState } from "react"
import { format } from "date-fns"
import { FolderIcon, GitBranchIcon } from "./Icons"

interface ProjectCardProps {
  project: {
    id: number
    name: string
    path?: string
    git_url?: string
    created_at: string
  }
  onUnregister: (projectId: number) => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onUnregister }) => {
  const [isUnregistering, setIsUnregistering] = useState(false)

  const handleUnregister = async () => {
    if (window.confirm(`Are you sure you want to unregister ${project.name}?`)) {
      try {
        setIsUnregistering(true)
        await onUnregister(project.id)
      } catch (error) {
        console.error("Error unregistering project:", error)
      } finally {
        setIsUnregistering(false)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-2">
          <FolderIcon className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="font-medium">{project.name}</h3>
        </div>

        {project.path && <p className="text-sm text-gray-600 mb-2 truncate">{project.path}</p>}

        {project.git_url && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <GitBranchIcon className="w-4 h-4 mr-1" />
            <span className="truncate">{project.git_url}</span>
          </div>
        )}

        <p className="text-xs text-gray-500">Created {format(new Date(project.created_at), "MMM d, yyyy")}</p>
      </div>

      <div className="bg-gray-50 px-4 py-3 border-t flex justify-between">
        <button className="text-sm text-blue-500 hover:text-blue-600">View Details</button>
        <button
          className="text-sm text-red-500 hover:text-red-600"
          onClick={handleUnregister}
          disabled={isUnregistering}
        >
          {isUnregistering ? "Unregistering..." : "Unregister"}
        </button>
      </div>
    </div>
  )
}

export default ProjectCard

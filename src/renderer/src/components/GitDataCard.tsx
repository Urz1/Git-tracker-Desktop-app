import type React from "react"

interface GitDataCardProps {
  gitData: {
    name: string
    branch: string
    commit: string
    message: string
    isDirty: boolean
    inserted: number
    deleted: number
    changed: number
  }
}

const GitDataCard: React.FC<GitDataCardProps> = ({ gitData }: GitDataCardProps) => {

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-700">{gitData.name}</h3>
          {gitData.branch && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {gitData.branch}
            </span>
          )}
        </div>

        {/* Commit message */}
        <p className="text-sm text-gray-600">{gitData.message}</p>

        {/* Git stats */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          {gitData.commit && (
            <span className="text-nowrap">
              <span className="font-medium">Commit:</span> {gitData.commit.substring(0, 8)}
            </span>
          )}

          {gitData.changed > 0 && (
            <span className="text-nowrap">
              <span className="font-medium">Changed:</span> {gitData.changed}
            </span>
          )}

          {gitData.inserted > 0 && (
            <span className="text-nowrap text-green-600">
              <span className="font-medium">+{gitData.inserted}</span>
            </span>
          )}

          {gitData.deleted > 0 && (
            <span className="text-nowrap text-red-600">
              <span className="font-medium">-{gitData.deleted}</span>
            </span>
          )}

          {gitData.isDirty && (
            <span className="text-nowrap text-orange-600">
              <span className="font-medium">⚠️ Dirty</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default GitDataCard

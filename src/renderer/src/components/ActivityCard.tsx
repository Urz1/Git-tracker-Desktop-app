import type React from "react"
import { format } from "date-fns"
import { CodeIcon, GlobeIcon, FileIcon } from "./Icons"

interface ActivityCardProps {
  activity: {
    app: string
    title: string
    file?: string
    url?: string
    activityType: string
    timestamp: number
    project?: string
  }
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const getActivityIcon = () => {
    switch (activity.activityType) {
      case "coding":
        return <CodeIcon className="w-5 h-5 text-blue-500" />
      case "browsing":
        return <GlobeIcon className="w-5 h-5 text-green-500" />
      default:
        return <FileIcon className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 min-w-fit">
          {getActivityIcon()}
          <h3 className="font-medium text-gray-700">{activity.app}:</h3>
        </div>

        <p className="text-sm text-gray-600 flex-1">{activity.title}</p>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs text-gray-500 min-w-fit">
          {activity.file && (
            <span className="text-nowrap">
              <span className="font-medium">File:</span> {activity.file}
            </span>
          )}

          {activity.url && (
            <span className="text-nowrap">
              <span className="font-medium">URL:</span> {activity.url}
            </span>
          )}

          {activity.project && (
            <span className="text-nowrap">
              <span className="font-medium">Project:</span> {activity.project}
            </span>
          )}

          <span className="text-nowrap">
            <span className="font-medium">Time:</span> {format(activity.timestamp, "h:mm a")}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ActivityCard

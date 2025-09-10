
import { Card, CardContent } from "@renderer/components/ui/card"
import { CustomProgress } from "@renderer/components/ui/custom-progress"
import { Camera, Keyboard, MousePointer, Clock } from "lucide-react"

export default function ProjectProgress() {
  return (
    <Card className="w-full border-0 shadow-none bg-transparent">
      <CardContent className="p-0">
        {/* Header with progress */}
        <div style={{marginBottom:32}} className="gap-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-700">Project Progress</h2>
            <span className="text-2xl font-semibold text-blue-600">75%</span>
          </div>

          {/* Progress bar */}
          <CustomProgress value={75} className="h-3 rounded-xl" barClassName="bg-blue-600" />

          {/* Timeline */}
          <div className="flex flex-col  sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 gap-2">
            <span>Started 9 weeks ago</span>
            <span>Due: 1/25/2024</span>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Screenshots */}
          <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-x-2 text-gray-600">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">Screenshots</span>
            </div>
            <span className="text-2xl font-semibold text-gray-900">78</span>
          </div>

          {/* Keystrokes */}
          <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-x-2 text-gray-600">
              <Keyboard className="w-4 h-4" />
              <span className="text-sm font-medium">Keystrokes</span>
            </div>
            <span className="text-2xl font-semibold text-gray-900">12,450</span>
          </div>

          {/* Clicks */}
          <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-x-2 text-gray-600">
              <MousePointer className="w-4 h-4" />
              <span className="text-sm font-medium">Clicks</span>
            </div>
            <span className="text-2xl font-semibold text-gray-900">3,240</span>
          </div>

          {/* Active Time */}
          <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Active Time</span>
            </div>
            <span className="text-2xl font-semibold text-gray-900">6.0h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import React from "react"
import { cn } from "../../lib/utils"

interface CustomProgressProps {
  value: number
  className?: string
  barClassName?: string
  max?: number
  showLabel?: boolean
}

export function CustomProgress({
  value,
  className,
  barClassName,
  max = 100,
  showLabel = false,
}: CustomProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className="relative">
      <div
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
          className
        )}
      >
        <div
          className={cn(
            "h-full bg-blue-600 transition-all duration-300 ease-in-out",
            barClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-gray-500 text-center">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
} 
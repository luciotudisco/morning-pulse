"use client"

import { Trash2, Pencil } from "lucide-react"
import { toString } from "cronstrue"
import { useRouter } from "next/navigation"
import type { ScheduledCallData } from "@/lib/schemas"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"

interface ScheduledCallItemProps {
  scheduledCall: ScheduledCallData
  onDelete: (id: number) => void
}

export function ScheduledCallItem({
  scheduledCall,
  onDelete,
}: ScheduledCallItemProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const formatSchedulePattern = (schedulePattern: string): string => {
    try {
      return toString(schedulePattern, {
        throwExceptionOnParseError: false,
        verbose: false,
      })
    } catch {
      return schedulePattern
    }
  }

  const handleOnDelete = (scheduledCallId: number) => {
    try {
      setIsDeleting(true)
      onDelete(scheduledCallId)
      setIsDeleting(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded">
      <div>
        <div className="font-medium text-black dark:text-white">
          {formatSchedulePattern(scheduledCall.schedule_pattern)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {scheduledCall.phone_number || "No phone"}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push(`/scheduled_calls/${scheduledCall.id}`)}
          className="p-1 text-gray-400 hover:text-blue-500"
          aria-label="Edit nudge"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleOnDelete(scheduledCall.id)}
          className="p-1 text-gray-400 hover:text-red-500"
          aria-label="Delete nudge"
          
        >
          {isDeleting ? <Spinner aria-label="Deleting nudge" className="size-4" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

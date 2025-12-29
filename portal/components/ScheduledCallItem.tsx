"use client";

import { Trash2 } from "lucide-react";
import { toString } from "cronstrue";
import type { ScheduledCallData } from "@/lib/schemas";

interface ScheduledCallItemProps {
  alarm: ScheduledCallData;
  onDelete: (id: number) => void;
}

export function ScheduledCallItem({ alarm, onDelete }: ScheduledCallItemProps) {
  const formatSchedulePattern = (schedulePattern: string): string => {
    try {
      return toString(schedulePattern, {
        throwExceptionOnParseError: false,
        verbose: false,
      });
    } catch {
      return schedulePattern;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded">
      <div>
        <div className="font-medium text-black dark:text-white">
          {formatSchedulePattern(alarm.schedule_pattern)} {alarm.timezone}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {alarm.phone_number || "No phone"}
        </div>
      </div>
      <button
        onClick={() => onDelete(alarm.id)}
        className="p-1 text-gray-400 hover:text-red-500"
        aria-label="Delete nudge"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

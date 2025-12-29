"use client";

import { useState, useEffect, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { ScheduledCallData } from "@/lib/schemas";

export default function AlarmPage() {
  const [alarms, setAlarms] = useState<ScheduledCallData[]>([]);
  const [time, setTime] = useState("07:00");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();


  useEffect(() => {
    const loadAlarms = async () => {
      setIsLoading(true);
      try {
        const scheduledCalls = await apiClient.listScheduledCalls();
        setAlarms(scheduledCalls);
      } catch (error: any) {
        console.error("Failed to load alarms:", error);
        // If unauthorized, redirect to login
        if (error?.response?.status === 401 || error?.message?.includes("401")) {
          window.location.href = "/login";
          return;
        }
        alert("Failed to load nudges. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAlarms();
  }, []);

  const timeToSchedulePattern = (timeString: string): string => {
    // Convert "HH:MM" format to schedule pattern "minute hour * * *" (daily)
    const [hours, minutes] = timeString.split(":");
    return `${minutes} ${hours} * * *`;
  };

  const schedulePatternToTime = (schedulePattern: string): string => {
    // Extract hour and minute from schedule pattern "minute hour * * *"
    const parts = schedulePattern.trim().split(/\s+/);
    if (parts.length >= 2) {
      const minute = parts[0].padStart(2, "0");
      const hour = parts[1].padStart(2, "0");
      return `${hour}:${minute}`;
    }
    return "00:00";
  };

  const handleAddAlarm = async () => {
    if (!phoneNumber) {
      alert("Please enter a phone number");
      return;
    }

    try {
      const schedulePattern = timeToSchedulePattern(time);
      const newAlarm = await apiClient.createScheduledCall({
        schedule_pattern: schedulePattern,
        phone_number: phoneNumber,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      startTransition(() => {
        setAlarms((prevAlarms) => [...prevAlarms, newAlarm]);
        setPhoneNumber("");
        setTime("07:00");
      });
    } catch (error: any) {
      if (error?.response?.status === 401 || error?.message?.includes("401")) {
        window.location.href = "/login";
        return;
      }
      const errorMessage = error instanceof Error ? error.message : "Failed to create nudge";
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDeleteAlarm = async (callId: number) => {
    try {
      await apiClient.deleteScheduledCall(callId);
      startTransition(() => {
        setAlarms((prevAlarms) => prevAlarms.filter((alarm) => alarm.id !== callId));
      });
    } catch (error: any) {
      console.error("Failed to delete alarm:", error);
    }
  };

  const formatSchedulePattern = (schedulePattern: string) => {
    // Parse schedule pattern and display as time
    const timeString = schedulePatternToTime(schedulePattern);
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-8 text-black dark:text-white">
          Schedule Nudge
        </h1>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:border-gray-500 dark:focus:border-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:border-gray-500 dark:focus:border-gray-500"
            />
          </div>

          <button
            onClick={handleAddAlarm}
            disabled={isPending}
            className="w-full py-2 px-4 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {isPending ? "Setting..." : "Schedule Nudge"}
          </button>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4 text-black dark:text-white">
            Scheduled Nudges
          </h2>
          {alarms.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No nudges scheduled
            </p>
          ) : (
            <div className="space-y-2">
              {alarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded"
                >
                  <div>
                    <div className="font-medium text-black dark:text-white">
                      {formatSchedulePattern(alarm.schedule_pattern)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {alarm.phone_number || "No phone"} • {alarm.timezone}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {alarm.schedule_pattern}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAlarm(alarm.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                    aria-label="Delete nudge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


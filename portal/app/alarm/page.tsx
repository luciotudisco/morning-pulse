"use client";

import { useState, useEffect, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toString } from "cronstrue";
import { apiClient } from "@/lib/api-client";
import type { ScheduledCallData } from "@/lib/schemas";

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday", short: "Sun" },
  { value: 1, label: "Monday", short: "Mon" },
  { value: 2, label: "Tuesday", short: "Tue" },
  { value: 3, label: "Wednesday", short: "Wed" },
  { value: 4, label: "Thursday", short: "Thu" },
  { value: 5, label: "Friday", short: "Fri" },
  { value: 6, label: "Saturday", short: "Sat" },
];

const WEEKDAYS = [1, 2, 3, 4, 5];

export default function AlarmPage() {
  const [alarms, setAlarms] = useState<ScheduledCallData[]>([]);
  const [time, setTime] = useState("07:00");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>(WEEKDAYS);
  const [isPending, startTransition] = useTransition();

  const handleAuthError = () => {
    window.location.href = "/login";
  };


  useEffect(() => {
    const loadAlarms = async () => {
      try {
        const scheduledCalls = await apiClient.listScheduledCalls();
        setAlarms(scheduledCalls);
      } catch (error: any) {
        if (error?.response?.status === 401) {
          handleAuthError();
          return;
        }
        console.error("Failed to load alarms:", error);
        alert("Failed to load nudges. Please refresh the page.");
      }
    };
    loadAlarms();
  }, []);

  const timeToSchedulePattern = (timeString: string, days: number[]): string => {
    const [hours, minutes] = timeString.split(":");
    const sortedDays = [...days].sort((a, b) => a - b);
    
    let dayPattern = "*";
    if (days.length === 7) {
      dayPattern = "*";
    } else if (days.length === 1) {
      dayPattern = days[0].toString();
    } else {
      const isConsecutive = sortedDays.every((day, idx) => 
        idx === 0 || day === sortedDays[idx - 1] + 1
      );
      dayPattern = isConsecutive 
        ? `${sortedDays[0]}-${sortedDays[sortedDays.length - 1]}`
        : sortedDays.join(",");
    }
    
    return `${minutes} ${hours} * * ${dayPattern}`;
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) => {
      const newDays = prev.includes(day) 
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort((a, b) => a - b);
      return newDays.length > 0 ? newDays : [day];
    });
  };

  const handleAddAlarm = async () => {
    if (!phoneNumber.trim()) {
      alert("Please enter a phone number");
      return;
    }

    try {
      const schedulePattern = timeToSchedulePattern(time, selectedDays);
      const newAlarm = await apiClient.createScheduledCall({
        schedule_pattern: schedulePattern,
        phone_number: phoneNumber,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      startTransition(() => {
        setAlarms((prev) => [...prev, newAlarm]);
        setPhoneNumber("");
        setTime("07:00");
        setSelectedDays(WEEKDAYS);
      });
    } catch (error: any) {
      if (error?.response?.status === 401) {
        handleAuthError();
        return;
      }
      alert(`Error: ${error instanceof Error ? error.message : "Failed to create nudge"}`);
    }
  };

  const handleDeleteAlarm = async (callId: number) => {
    try {
      await apiClient.deleteScheduledCall(callId);
      startTransition(() => {
        setAlarms((prev) => prev.filter((alarm) => alarm.id !== callId));
      });
    } catch (error) {
      console.error("Failed to delete alarm:", error);
    }
  };

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
              Days of Week
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                    selectedDays.includes(day.value)
                      ? "bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {selectedDays.length === 7 
                ? "Every day" 
                : selectedDays.length === 5 && selectedDays.every((d) => WEEKDAYS.includes(d))
                ? "Weekdays"
                : selectedDays.length === 2 && selectedDays.every((d) => [0, 6].includes(d))
                ? "Weekends"
                : `Selected: ${selectedDays.map((d) => DAYS_OF_WEEK[d].short).join(", ")}`}
            </p>
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
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">
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


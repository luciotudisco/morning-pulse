"use client";

import { useState, useEffect, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { format, addDays, startOfWeek } from "date-fns";
import { toString } from "cronstrue";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { apiClient } from "@/lib/api-client";
import type { ScheduledCallData } from "@/lib/schemas";

// Generate days of week using date-fns (Monday-Sunday order: 1,2,3,4,5,6,0)
const DAYS_OF_WEEK = Array.from({ length: 7 }, (_, i) => {
  const date = addDays(startOfWeek(new Date(2024, 0, 1), { weekStartsOn: 1 }), i);
  return {
    value: date.getDay(), // 0 = Sunday, 1 = Monday, etc.
    short: format(date, "EEE"), // "Mon", "Tue", etc.
  };
});


export default function AlarmPage() {
  const [alarms, setAlarms] = useState<ScheduledCallData[]>([]);
  const [time, setTime] = useState("07:00");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isPending, startTransition] = useTransition();

  const handleAuthError = () => {
    //window.location.href = "/login";
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
        setSelectedDays([1, 2, 3, 4, 5]);
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
            <ButtonGroup className="w-full" aria-label="Days of week selection">
              {DAYS_OF_WEEK.map((day) => (
                <Button
                  key={day.value}
                  type="button"
                  variant={selectedDays.includes(day.value) ? "default" : "outline"}
                  onClick={() => toggleDay(day.value)}
                  className="flex-1"
                >
                  {day.short}
                </Button>
              ))}
            </ButtonGroup>
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


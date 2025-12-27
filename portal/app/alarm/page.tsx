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

  // Get browser's default timezone
  const getBrowserTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  useEffect(() => {
    const loadAlarms = async () => {
      setIsLoading(true);
      try {
        const scheduledCalls = await apiClient.listScheduledCalls();
        setAlarms(scheduledCalls);
      } catch (error) {
        console.error("Failed to load alarms:", error);
        alert("Failed to load alarms. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAlarms();
  }, []);

  const handleAddAlarm = async () => {
    if (!phoneNumber) {
      alert("Please enter a phone number");
      return;
    }

    try {
      const newAlarm = await apiClient.createScheduledCall({
        scheduled_time: time, // API expects "HH:MM" format
        phone_number: phoneNumber,
        timezone: getBrowserTimezone(), 
      });

      startTransition(() => {
        setAlarms((prevAlarms) => [...prevAlarms, newAlarm]);
        setPhoneNumber("");
        setTime("07:00");
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create alarm";
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDeleteAlarm = async (index: number) => {
    const updatedAlarms = alarms.filter((_, i) => i !== index);
    setAlarms(updatedAlarms);
  };

  const formatTime = (timeString: string) => {
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
          Set Alarm
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
            {isPending ? "Setting..." : "Set Alarm"}
          </button>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4 text-black dark:text-white">
            Alarms
          </h2>
          {alarms.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No alarms set
            </p>
          ) : (
            <div className="space-y-2">
              {alarms.map((alarm, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded"
                >
                  <div>
                    <div className="font-medium text-black dark:text-white">
                      {formatTime(alarm.scheduled_time)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {alarm.phone_number || "No phone"} • {alarm.timezone}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAlarm(index)}
                    className="p-1 text-gray-400 hover:text-red-500"
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


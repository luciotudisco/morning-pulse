"use client";

import { useState } from "react";
import { Clock, Plus, Trash2 } from "lucide-react";

interface ScheduledCall {
  scheduled_time: string;
  timezone: string;
  phone_number: string | null;
}

export default function AlarmPage() {
  const [alarms, setAlarms] = useState<ScheduledCall[]>([]);
  const [time, setTime] = useState("07:00");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddAlarm = async () => {
    if (!phoneNumber) {
      alert("Please enter a phone number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/scheduled-calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduled_time: `${time}:00`,
          phone_number: phoneNumber,
          timezone: timezone,
        }),
      });

      if (response.ok) {
        const newAlarm = await response.json();
        setAlarms([...alarms, newAlarm]);
        setPhoneNumber("");
        setTime("07:00");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to create alarm"}`);
      }
    } catch (error) {
      alert("Failed to create alarm. Please try again.");
    } finally {
      setIsLoading(false);
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

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:border-gray-500 dark:focus:border-gray-500"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>

          <button
            onClick={handleAddAlarm}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {isLoading ? "Setting..." : "Set Alarm"}
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


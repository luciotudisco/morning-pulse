"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft } from "lucide-react";
import { format, addDays, startOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { apiClient } from "@/lib/api-client";

// Generate days of week using date-fns (Monday-Sunday order: 1,2,3,4,5,6,0)
const DAYS_OF_WEEK = Array.from({ length: 7 }, (_, i) => {
  const date = addDays(startOfWeek(new Date(2024, 0, 1), { weekStartsOn: 1 }), i);
  return {
    value: date.getDay(), // 0 = Sunday, 1 = Monday, etc.
    short: format(date, "EEE"), // "Mon", "Tue", etc.
  };
});

export default function NewAlarmPage() {
  const router = useRouter();
  const [time, setTime] = useState("07:00");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isPending, startTransition] = useTransition();

  const handleAuthError = () => {
    //window.location.href = "/login";
  };

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
      await apiClient.createScheduledCall({
        schedule_pattern: schedulePattern,
        phone_number: phoneNumber,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      // Redirect to the list page after successful creation
      router.push("/alarm");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          handleAuthError();
          return;
        }
      }
      alert(`Error: ${error instanceof Error ? error.message : "Failed to create nudge"}`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/alarm")}
            aria-label="Back to scheduled calls"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Create New Nudge
          </h1>
        </div>

        <div className="space-y-4">
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

          <Button
            onClick={handleAddAlarm}
            disabled={isPending}
            className="w-full"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isPending ? "Creating..." : "Create Nudge"}
          </Button>
        </div>
      </div>
    </div>
  );
}


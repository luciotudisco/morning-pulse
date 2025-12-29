"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { apiClient } from "@/lib/api-client";

// Day name map: day value -> { short, long }
const DAY_NAMES: Record<number, { short: string; long: string }> = {
  0: { short: "Sun", long: "Sunday" },
  1: { short: "Mon", long: "Monday" },
  2: { short: "Tue", long: "Tuesday" },
  3: { short: "Wed", long: "Wednesday" },
  4: { short: "Thu", long: "Thursday" },
  5: { short: "Fri", long: "Friday" },
  6: { short: "Sat", long: "Saturday" },
};

// Generate days of week (Monday-Sunday order: 1,2,3,4,5,6,0)
const DAYS_OF_WEEK = [1, 2, 3, 4, 5, 6, 0].map((dayValue) => ({
  value: dayValue, // 0 = Sunday, 1 = Monday, etc.
  short: DAY_NAMES[dayValue].short, // "Mon", "Tue", etc.
  long: DAY_NAMES[dayValue].long, // "Monday", "Tuesday", etc.
}));

export default function NewAlarmPage() {
  const router = useRouter();
  const [time, setTime] = useState("07:00");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isPending, startTransition] = useTransition();

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
      toast.error("Please enter a phone number");
      return;
    }

    try {
      const schedulePattern = timeToSchedulePattern(time, selectedDays);
      await apiClient.createScheduledCall({
        schedule_pattern: schedulePattern,
        phone_number: phoneNumber,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      toast.success("Nudge created successfully!");
      router.push("/alarm");
    } catch (error: unknown) {
        toast.error("Oops! Something went wrong. Please try again.");
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
            New Nudge
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


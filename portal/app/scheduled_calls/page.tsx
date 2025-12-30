"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScheduledCallItem } from "@/components/ScheduledCallItem";
import { apiClient } from "@/lib/api-client";
import type { ScheduledCallData } from "@/lib/schemas";

export default function AlarmPage() {
  const router = useRouter();
  const [alarms, setAlarms] = useState<ScheduledCallData[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const loadAlarms = async () => {
      try {
        const scheduledCalls = await apiClient.listScheduledCalls();
        setAlarms(scheduledCalls);
      } catch (error: unknown) {
        toast.error("Oops! Something went wrong. Please refresh the page.");
      }
    };
    loadAlarms();
  }, []);


  const handleDeleteAlarm = async (callId: number) => {
    try {
      await apiClient.deleteScheduledCall(callId);
      setAlarms((prev) => prev.filter((alarm) => alarm.id !== callId));
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-end mb-8">
          <Button onClick={() => router.push("/scheduled_calls/new")}>
            <Plus className="w-4 h-4 mr-2" />
            New
          </Button>
        </div>

        {alarms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              No nudges scheduled
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {alarms.map((alarm) => (
              <ScheduledCallItem
                key={alarm.id}
                alarm={alarm}
                onDelete={handleDeleteAlarm}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduledCallItem } from "@/components/ScheduledCallItem";
import { apiClient } from "@/lib/api-client";
import type { ScheduledCallData } from "@/lib/schemas";

export default function AlarmPage() {
  const router = useRouter();
  const [alarms, setAlarms] = useState<ScheduledCallData[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleAuthError = () => {
    //window.location.href = "/login";
  };


  useEffect(() => {
    const loadAlarms = async () => {
      try {
        const scheduledCalls = await apiClient.listScheduledCalls();
        setAlarms(scheduledCalls);
      } catch (error: unknown) {
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 401) {
            handleAuthError();
            return;
          }
        }
        console.error("Failed to load alarms:", error);
        alert("Failed to load nudges. Please refresh the page.");
      }
    };
    loadAlarms();
  }, []);


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


  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Scheduled Nudges
          </h1>
          <Button onClick={() => router.push("/alarm/new")}>
            <Plus className="w-4 h-4 mr-2" />
            New Nudge
          </Button>
        </div>

        {alarms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              No nudges scheduled
            </p>
            <Button onClick={() => router.push("/alarm/new")} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Nudge
            </Button>
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


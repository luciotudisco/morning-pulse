"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScheduledCallItem } from "@/components/ScheduledCallItem";
import { apiClient } from "@/lib/api-client";
import type { ScheduledCallData } from "@/lib/schemas";
import { Loading } from "@/components/Loading";
import { RainbowButton } from "@/components/ui/rainbow-button";

export default function ScheduledCallsPage() {
  const router = useRouter();
  const [alarms, setAlarms] = useState<ScheduledCallData[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const scheduledCalls = await apiClient.listScheduledCalls();
        setAlarms(scheduledCalls);
      } catch {
        toast.error("Oops! Something went wrong. Please refresh the page.");
      }
    });
  }, []);


  const handleDeleteScheduledCall = async (callId: number) => {
    try {
      await apiClient.deleteScheduledCall(callId);
      setAlarms((prev) => prev.filter((alarm) => alarm.id !== callId));
    } catch {
      toast.error("Oops! Something went wrong. Please try again.");
    }
  };

  if (isPending) {
    return <div className="min-h-screen p-8 flex flex-col items-center pt-[33vh]"><Loading size="lg"/></div>
  }

  if (alarms.length === 0) {
    return <div className="min-h-screen p-[10vh] flex flex-col items-center">
      <p className="text-center text-lg font-medium mb-2">You don't have any nudge yet</p>
      <p className="text-center text-sm text-muted-foreground mb-6 max-w-md">Get started by scheduling your first nudge.</p>
      <RainbowButton size="lg" className="text-base" onClick={() => router.push("/scheduled_calls/new")}>
        <Plus className="w-4 h-4 mr-2" />
        Schedule Your First Nudge
      </RainbowButton>
      </div>
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-end mb-8">
          <Button onClick={() => router.push("/scheduled_calls/new")}>
            <Plus className="w-4 h-4 mr-2" />
            New
          </Button>
        </div>
          <div className="space-y-2">
            {alarms.map((alarm) => (
              <ScheduledCallItem
                key={alarm.id}
                alarm={alarm}
                onDelete={handleDeleteScheduledCall}
              />
            ))}
          </div>
      </div>
    </div>
  );
}


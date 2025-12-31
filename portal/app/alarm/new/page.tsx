"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { apiClient } from "@/lib/api-client";

const DAY_NAMES: Record<number, { short: string; long: string }> = {
  0: { short: "Su", long: "Sunday" },
  1: { short: "Mo", long: "Monday" },
  2: { short: "Tu", long: "Tuesday" },
  3: { short: "We", long: "Wednesday" },
  4: { short: "Th", long: "Thursday" },
  5: { short: "Fr", long: "Friday" },
  6: { short: "Sa", long: "Saturday" },
};

const alarmFormSchema = z.object({
  time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time",
  }),
  phoneNumber: z.string().min(1, {
    message: "Please enter a phone number",
  }),
  selectedDays: z.array(z.number().int().min(0).max(6)).min(1, {
    message: "Please select at least one day",
  }),
});

type AlarmFormData = z.infer<typeof alarmFormSchema>;

export default function NewAlarmPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AlarmFormData>({
    resolver: zodResolver(alarmFormSchema),
    defaultValues: {
      time: "07:00",
      phoneNumber: "",
      selectedDays: [1, 2, 3, 4, 5],
    },
  });

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

  const onSubmit = async (data: AlarmFormData) => {
    startTransition(async () => {
      try {
        const schedulePattern = timeToSchedulePattern(data.time, data.selectedDays);
        await apiClient.createScheduledCall({
          schedule_pattern: schedulePattern,
          phone_number: data.phoneNumber,
        });
        router.push("/alarm");
      } catch (error: unknown) {
        toast.error("Oops! Something went wrong. Please try again.");
      }
    });
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Time
            </label>
            <input
              type="time"
              {...register("time")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:border-gray-500 dark:focus:border-gray-500"
            />
            {errors.time && (
              <p className="mt-1 text-xs text-red-500">{errors.time.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Days of Week
            </label>
            <Controller
              name="selectedDays"
              control={control}
              render={({ field }) => (
                <ButtonGroup className="w-full" aria-label="Days of week selection">
                  {Object.keys(DAY_NAMES).map((day) => {
                    const dayNum = parseInt(day);
                    const isSelected = field.value.includes(dayNum);
                    return (
                      <Button
                        key={day}
                        type="button"
                        variant={isSelected ? "secondary" : "outline"}
                        onClick={() => {
                          const newDays = isSelected
                            ? field.value.filter((d) => d !== dayNum)
                            : [...field.value, dayNum].sort((a, b) => a - b);
                          field.onChange(newDays.length > 0 ? newDays : [dayNum]);
                        }}
                        className="flex-1"
                      >
                        {DAY_NAMES[dayNum].short}
                      </Button>
                    );
                  })}
                </ButtonGroup>
              )}
            />
            {errors.selectedDays && (
              <p className="mt-1 text-xs text-red-500">{errors.selectedDays.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              {...register("phoneNumber")}
              placeholder="+1234567890"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:border-gray-500 dark:focus:border-gray-500"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isPending ? "Creating..." : "Create Nudge"}
          </Button>
        </form>
      </div>
    </div>
  );
}


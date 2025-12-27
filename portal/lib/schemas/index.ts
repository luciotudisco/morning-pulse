/**
 * Type schemas matching the API
 */

export interface ScheduledCallData {
  scheduled_time: string; // Format: "HH:MM:SS"
  timezone: string;
  phone_number: string | null;
}

export interface CreateScheduledCallRequest {
  scheduled_time: string; // Format: "HH:MM"
  phone_number: string;
  timezone?: string; // Default: "UTC"
}


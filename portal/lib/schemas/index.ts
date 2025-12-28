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

export interface User {
  user_id: string;
  email: string | null;
  name: string | null;
  given_name: string | null;
  family_name: string | null;
  picture: string | null;
  phone_number: string | null;
}



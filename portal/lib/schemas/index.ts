/**
 * Type schemas matching the API
 */

export interface ScheduledCallData {
  id: number
  schedule_pattern: string // Schedule pattern (cron expression, e.g., "0 7 * * *" for 7 AM daily)
  timezone: string
  phone_number: string | null
}

export interface CreateScheduledCallRequest {
  schedule_pattern: string // Schedule pattern (cron expression with 5 fields: minute hour day month weekday)
  phone_number: string
  timezone?: string // Default: "UTC"
}

export interface User {
  user_id: string
  email: string | null
  name: string | null
  given_name: string | null
  family_name: string | null
  picture: string | null
  phone_number: string | null
}

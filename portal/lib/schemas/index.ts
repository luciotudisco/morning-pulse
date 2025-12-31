/**
 * Type schemas matching the API
 */

export interface ScheduledCallData {
  id: number
  schedule_pattern: string
  phone_number: string | null
}

export interface CreateScheduledCallRequest {
  schedule_pattern: string 
  phone_number: string
}

export interface UpdateScheduledCallRequest {
  schedule_pattern: string
  phone_number: string
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

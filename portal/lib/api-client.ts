import axios, { AxiosInstance } from "axios"
import type {
  ScheduledCallData,
  CreateScheduledCallRequest,
  UpdateScheduledCallRequest,
  User,
} from "@/lib/schemas"

export class ScheduledCall {
  private axiosInstance: AxiosInstance

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_URL
    const headers = { "Content-Type": "application/json" }
    this.axiosInstance = axios.create({
      baseURL,
      withCredentials: true,
      headers,
    })
  }

  async listScheduledCalls(): Promise<ScheduledCallData[]> {
    const response =
      await this.axiosInstance.get<ScheduledCallData[]>("/scheduled_calls")
    return response.data
  }

  async createScheduledCall(
    request: CreateScheduledCallRequest
  ): Promise<ScheduledCallData> {
    const response = await this.axiosInstance.post<ScheduledCallData>(
      "/scheduled_calls",
      request
    )
    return response.data
  }

  async updateScheduledCall(
    callId: number,
    request: UpdateScheduledCallRequest
  ): Promise<ScheduledCallData> {
    const response = await this.axiosInstance.put<ScheduledCallData>(
      `/scheduled_calls/${callId}`,
      request
    )
    return response.data
  }

  async deleteScheduledCall(callId: number): Promise<void> {
    await this.axiosInstance.delete(`/scheduled_calls/${callId}`)
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.axiosInstance.get<User>("/auth/me")
    return response.data
  }
}

export const apiClient = new ScheduledCall()

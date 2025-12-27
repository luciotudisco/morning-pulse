import axios, { AxiosInstance } from "axios";
import type { ScheduledCallData, CreateScheduledCallRequest } from "@/lib/schemas";

/**
 * API Client class for interacting with the scheduled calls API
 */
export class ScheduledCall {
  private axiosInstance: AxiosInstance;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_URL
    const headers = { 'Content-Type': 'application/json' }
    this.axiosInstance = axios.create({ baseURL, withCredentials: true, headers })
  }

  async listScheduledCalls(): Promise<ScheduledCallData[]> {
    const response = await this.axiosInstance.get<ScheduledCallData[]>("/scheduled_calls");
    return response.data;
  }

  async createScheduledCall(request: CreateScheduledCallRequest): Promise<ScheduledCallData> {
    const response = await this.axiosInstance.post<ScheduledCallData>("/scheduled_calls", request);
    return response.data;
  }
}

export const apiClient = new ScheduledCall();


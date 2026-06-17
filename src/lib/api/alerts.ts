import { apiClient } from "./client";
import type { RiskAlert } from "@/types/api";

export async function getAlerts(token: string): Promise<{ data: RiskAlert[] }> {
  return apiClient<{ data: RiskAlert[] }>("/therapist/alerts", { token });
}

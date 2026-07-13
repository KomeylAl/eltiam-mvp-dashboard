import { apiClient } from "./client";
import { buildQueryString } from "@/lib/utils";
import type { PaginatedResponse, PaginationParams, RiskAlert } from "@/types/api";

export async function getAlerts(
  token: string,
  params?: PaginationParams
): Promise<PaginatedResponse<RiskAlert>> {
  return apiClient<PaginatedResponse<RiskAlert>>(
    `/therapist/alerts${buildQueryString(params ?? {})}`,
    { token }
  );
}

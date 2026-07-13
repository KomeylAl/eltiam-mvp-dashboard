import { apiClient } from "./client";
import { buildQueryString } from "@/lib/utils";
import type {
  CreatePatientPayload,
  Intervention,
  Measurement,
  PaginatedResponse,
  PaginationParams,
  Patient,
  SafetyPlan,
  SocialProblem,
  UpdatePatientPayload,
  WordGame,
} from "@/types/api";

export async function getPatients(
  token: string,
  params?: PaginationParams
): Promise<PaginatedResponse<Patient>> {
  return apiClient<PaginatedResponse<Patient>>(
    `/therapist/patients${buildQueryString(params ?? {})}`,
    { token }
  );
}

export async function getPatient(
  token: string,
  id: number
): Promise<{ data: Patient }> {
  return apiClient<{ data: Patient }>(`/therapist/patients/${id}`, { token });
}

export async function createPatient(
  token: string,
  payload: CreatePatientPayload
): Promise<{ data: Patient }> {
  return apiClient<{ data: Patient }>("/therapist/patients", {
    method: "POST",
    body: payload,
    token,
  });
}

export async function updatePatient(
  token: string,
  id: number,
  payload: UpdatePatientPayload
): Promise<{ data: Patient }> {
  return apiClient<{ data: Patient }>(`/therapist/patients/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });
}

export async function deletePatient(
  token: string,
  id: number
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/therapist/patients/${id}`, {
    method: "DELETE",
    token,
  });
}

export async function getMeasurements(
  token: string,
  patientId: number,
  params?: PaginationParams
): Promise<PaginatedResponse<Measurement>> {
  return apiClient<PaginatedResponse<Measurement>>(
    `/therapist/patients/${patientId}/measurements${buildQueryString(params ?? {})}`,
    { token }
  );
}

export async function getInterventions(
  token: string,
  patientId: number,
  params?: PaginationParams
): Promise<PaginatedResponse<Intervention>> {
  return apiClient<PaginatedResponse<Intervention>>(
    `/therapist/patients/${patientId}/interventions${buildQueryString(params ?? {})}`,
    { token }
  );
}

export async function getSocialProblems(
  token: string,
  patientId: number,
  params?: PaginationParams
): Promise<PaginatedResponse<SocialProblem>> {
  return apiClient<PaginatedResponse<SocialProblem>>(
    `/therapist/patients/${patientId}/social-problems${buildQueryString(params ?? {})}`,
    { token }
  );
}

export async function getWordGames(
  token: string,
  patientId: number,
  params?: PaginationParams
): Promise<PaginatedResponse<WordGame>> {
  return apiClient<PaginatedResponse<WordGame>>(
    `/therapist/patients/${patientId}/word-games${buildQueryString(params ?? {})}`,
    { token }
  );
}

export async function getSafetyPlans(
  token: string,
  patientId: number,
  params?: PaginationParams
): Promise<PaginatedResponse<SafetyPlan>> {
  return apiClient<PaginatedResponse<SafetyPlan>>(
    `/therapist/patients/${patientId}/safety-plans${buildQueryString(params ?? {})}`,
    { token }
  );
}

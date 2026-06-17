import { apiClient } from "./client";
import type {
  CreatePatientPayload,
  Intervention,
  Measurement,
  Patient,
  SafetyPlan,
  SocialProblem,
  UpdatePatientPayload,
  WordGame,
} from "@/types/api";

export async function getPatients(token: string): Promise<{ data: Patient[] }> {
  return apiClient<{ data: Patient[] }>("/therapist/patients", { token });
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
  patientId: number
): Promise<{ data: Measurement[] }> {
  return apiClient<{ data: Measurement[] }>(
    `/therapist/patients/${patientId}/measurements`,
    { token }
  );
}

export async function getInterventions(
  token: string,
  patientId: number
): Promise<{ data: Intervention[] }> {
  return apiClient<{ data: Intervention[] }>(
    `/therapist/patients/${patientId}/interventions`,
    { token }
  );
}

export async function getSocialProblems(
  token: string,
  patientId: number
): Promise<{ data: SocialProblem[] }> {
  return apiClient<{ data: SocialProblem[] }>(
    `/therapist/patients/${patientId}/social-problems`,
    { token }
  );
}

export async function getWordGames(
  token: string,
  patientId: number
): Promise<{ data: WordGame[] }> {
  return apiClient<{ data: WordGame[] }>(
    `/therapist/patients/${patientId}/word-games`,
    { token }
  );
}

export async function getSafetyPlans(
  token: string,
  patientId: number
): Promise<{ data: SafetyPlan[] }> {
  return apiClient<{ data: SafetyPlan[] }>(
    `/therapist/patients/${patientId}/safety-plans`,
    { token }
  );
}

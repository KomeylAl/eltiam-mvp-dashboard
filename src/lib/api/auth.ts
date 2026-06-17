import { apiClient } from "./client";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/api";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function getMe(token: string): Promise<{ data: User }> {
  return apiClient<{ data: User }>("/auth/me", { token });
}

export async function logout(token: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>("/auth/logout", {
    method: "POST",
    token,
  });
}

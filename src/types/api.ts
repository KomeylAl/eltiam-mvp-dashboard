export interface User {
  id: number;
  role: "therapist" | "patient";
  name: string;
  phone: string;
  therapist_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: number;
  therapist_id: number;
  name: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface Measurement {
  id: number;
  user_id: number;
  date: string;
  time: string;
  q_number: number;
  a_number: number;
  created_at: string;
  updated_at: string;
}

export interface Intervention {
  id: number;
  user_id: number;
  date: string;
  time: string;
  q_number: number;
  a_number: number;
  created_at: string;
  updated_at: string;
}

export interface SocialProblem {
  id: number;
  user_id: number;
  problem: string;
  reason: string;
  solutions: string;
  evaluations: string;
  bestindex: number;
  plan: string;
  date: string;
  time: string;
  created_at: string;
  updated_at: string;
}

export interface WordGame {
  id: number;
  user_id: number;
  point: number;
  date: string;
  time: string;
  created_at: string;
  updated_at: string;
}

export interface SafetyPlan {
  id: number;
  user_id: number;
  question_one: string;
  question_two: string;
  thinking_feelings: string;
  self_help: string;
  others_help: string;
  close_people_list: string;
  close_friends_thoughts: string;
  phone_calls: string;
  protected_places: string;
  date: string;
  time: string;
  created_at: string;
  updated_at: string;
}

export interface RiskAlert {
  id: number;
  patient: Patient;
  source_type: "measurement" | "intervention";
  source_id: number;
  risk_level: 3 | 4;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
}

export interface CreatePatientPayload {
  name: string;
  phone: string;
  password: string;
}

export interface UpdatePatientPayload {
  name?: string;
  phone?: string;
  password?: string;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

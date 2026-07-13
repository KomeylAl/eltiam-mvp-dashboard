import type {
  Intervention,
  Measurement,
  RiskAlert,
  SafetyPlan,
  SocialProblem,
  User,
  WordGame,
} from "@prisma/client";
import { formatDate, formatTimestamp, toNumber } from "@/lib/server/serialize";

export function serializeUser(user: User) {
  return {
    id: toNumber(user.id),
    role: user.role,
    name: user.name,
    phone: user.phone,
    therapist_id: toNumber(user.therapist_id),
    created_at: formatTimestamp(user.created_at),
    updated_at: formatTimestamp(user.updated_at),
  };
}

export function serializePatient(user: User) {
  return {
    id: toNumber(user.id),
    therapist_id: toNumber(user.therapist_id),
    name: user.name,
    phone: user.phone,
    created_at: formatTimestamp(user.created_at),
    updated_at: formatTimestamp(user.updated_at),
  };
}

export function serializeMeasurement(measurement: Measurement) {
  return {
    id: toNumber(measurement.id),
    user_id: toNumber(measurement.user_id),
    date: formatDate(measurement.date),
    time: measurement.time,
    q_number: measurement.q_number,
    a_number: measurement.a_number,
    created_at: formatTimestamp(measurement.created_at),
    updated_at: formatTimestamp(measurement.updated_at),
  };
}

export function serializeIntervention(intervention: Intervention) {
  return {
    id: toNumber(intervention.id),
    user_id: toNumber(intervention.user_id),
    date: formatDate(intervention.date),
    time: intervention.time,
    q_number: intervention.q_number,
    a_number: intervention.a_number,
    created_at: formatTimestamp(intervention.created_at),
    updated_at: formatTimestamp(intervention.updated_at),
  };
}

export function serializeSocialProblem(socialProblem: SocialProblem) {
  return {
    id: toNumber(socialProblem.id),
    user_id: toNumber(socialProblem.user_id),
    problem: socialProblem.problem,
    reason: socialProblem.reason,
    solutions: socialProblem.solutions,
    evaluations: socialProblem.evaluations,
    bestindex: socialProblem.bestindex,
    plan: socialProblem.plan,
    date: formatDate(socialProblem.date),
    time: socialProblem.time,
    created_at: formatTimestamp(socialProblem.created_at),
    updated_at: formatTimestamp(socialProblem.updated_at),
  };
}

export function serializeWordGame(wordGame: WordGame) {
  return {
    id: toNumber(wordGame.id),
    user_id: toNumber(wordGame.user_id),
    point: wordGame.point,
    date: formatDate(wordGame.date),
    time: wordGame.time,
    created_at: formatTimestamp(wordGame.created_at),
    updated_at: formatTimestamp(wordGame.updated_at),
  };
}

export function serializeSafetyPlan(safetyPlan: SafetyPlan) {
  return {
    id: toNumber(safetyPlan.id),
    user_id: toNumber(safetyPlan.user_id),
    question_one: safetyPlan.question_one,
    question_two: safetyPlan.question_two,
    thinking_feelings: safetyPlan.thinking_feelings,
    self_help: safetyPlan.self_help,
    others_help: safetyPlan.others_help,
    close_people_list: safetyPlan.close_people_list,
    close_friends_thoughts: safetyPlan.close_friends_thoughts,
    phone_calls: safetyPlan.phone_calls,
    protected_places: safetyPlan.protected_places,
    date: formatDate(safetyPlan.date),
    time: safetyPlan.time,
    created_at: formatTimestamp(safetyPlan.created_at),
    updated_at: formatTimestamp(safetyPlan.updated_at),
  };
}

export function serializeRiskAlert(
  alert: RiskAlert,
  patient: User
) {
  return {
    id: toNumber(alert.id),
    patient: serializePatient(patient),
    source_type: alert.source_type,
    source_id: toNumber(alert.source_id),
    risk_level: alert.risk_level,
    reviewed_at: formatTimestamp(alert.reviewed_at),
    created_at: formatTimestamp(alert.created_at),
    updated_at: formatTimestamp(alert.updated_at),
  };
}

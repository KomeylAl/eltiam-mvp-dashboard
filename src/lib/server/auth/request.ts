import type { NextRequest } from "next/server";
import type { User } from "@prisma/client";
import { findUserByAccessToken } from "@/lib/server/auth/tokens";

export function getBearerToken(request: NextRequest): string | null {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim() || null;
}

export async function authenticateRequest(
  request: NextRequest
): Promise<User | null> {
  const token = getBearerToken(request);

  if (!token) {
    return null;
  }

  return findUserByAccessToken(token);
}

export function isTherapist(user: User): boolean {
  return user.role === "therapist";
}

export function isPatient(user: User): boolean {
  return user.role === "patient";
}

export function ownsPatient(therapist: User, patient: User): boolean {
  return (
    therapist.role === "therapist" &&
    patient.role === "patient" &&
    patient.therapist_id === therapist.id
  );
}

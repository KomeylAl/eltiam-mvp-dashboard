import { NextRequest } from "next/server";
import {
  authenticateRequest,
  getBearerToken,
} from "@/lib/server/auth/request";
import { revokeAccessToken } from "@/lib/server/auth/tokens";
import { jsonResponse, unauthenticatedResponse } from "@/lib/server/http";

export async function POST(request: NextRequest) {
  const user = await authenticateRequest(request);

  if (!user) {
    return unauthenticatedResponse();
  }

  const token = getBearerToken(request);

  if (token) {
    await revokeAccessToken(token);
  }

  return jsonResponse({ message: "Logged out successfully." });
}

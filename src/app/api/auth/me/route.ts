import { NextRequest } from "next/server";
import {
  authenticateRequest,
  getBearerToken,
} from "@/lib/server/auth/request";
import { revokeAccessToken } from "@/lib/server/auth/tokens";
import { jsonResponse, unauthenticatedResponse } from "@/lib/server/http";
import { serializeUser } from "@/lib/server/resources";

export async function GET(request: NextRequest) {
  const user = await authenticateRequest(request);

  if (!user) {
    return unauthenticatedResponse();
  }

  return jsonResponse({ data: serializeUser(user) });
}

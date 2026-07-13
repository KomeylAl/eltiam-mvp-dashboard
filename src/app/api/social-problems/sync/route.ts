import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { authenticateRequest } from "@/lib/server/auth/request";
import {
  jsonResponse,
  unauthenticatedResponse,
  validationErrorResponse,
} from "@/lib/server/http";
import { syncSocialProblems } from "@/lib/server/services/sync";
import { syncSocialProblemsSchema } from "@/lib/server/validation";

export async function POST(request: NextRequest) {
  const user = await authenticateRequest(request);

  if (!user) {
    return unauthenticatedResponse();
  }

  try {
    const body = syncSocialProblemsSchema.parse(await request.json());
    const inserted = await syncSocialProblems(user, body.data);

    return jsonResponse({
      success: true,
      inserted,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }

    throw error;
  }
}

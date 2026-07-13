import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { authenticateRequest } from "@/lib/server/auth/request";
import {
  jsonResponse,
  unauthenticatedResponse,
  validationErrorResponse,
} from "@/lib/server/http";
import { syncInterventions } from "@/lib/server/services/sync";
import { syncInterventionsSchema } from "@/lib/server/validation";

export async function POST(request: NextRequest) {
  const user = await authenticateRequest(request);

  if (!user) {
    return unauthenticatedResponse();
  }

  try {
    const body = syncInterventionsSchema.parse(await request.json());
    const inserted = await syncInterventions(user, body.data);

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

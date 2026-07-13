import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/server/auth/password";
import { createAccessToken } from "@/lib/server/auth/tokens";
import {
  invalidCredentialsResponse,
  jsonResponse,
  validationErrorResponse,
} from "@/lib/server/http";
import { serializeUser } from "@/lib/server/resources";
import { loginSchema } from "@/lib/server/validation";

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({
      where: { phone: body.phone },
    });

    if (!user || !(await verifyPassword(body.password, user.password))) {
      return invalidCredentialsResponse();
    }

    const token = await createAccessToken(user);

    return jsonResponse({
      user: serializeUser(user),
      token,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }

    throw error;
  }
}

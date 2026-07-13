import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/server/auth/password";
import { createAccessToken } from "@/lib/server/auth/tokens";
import {
  jsonResponse,
  validationErrorResponse,
} from "@/lib/server/http";
import { serializeUser } from "@/lib/server/resources";
import { registerTherapistSchema } from "@/lib/server/validation";

export async function POST(request: NextRequest) {
  try {
    const body = registerTherapistSchema.parse(await request.json());
    const existing = await prisma.user.findUnique({
      where: { phone: body.phone },
    });

    if (existing) {
      return validationErrorResponse(
        new ZodError([
          {
            code: "custom",
            message: "The phone has already been taken.",
            path: ["phone"],
          },
        ])
      );
    }

    const now = new Date();
    const therapist = await prisma.user.create({
      data: {
        name: body.name,
        phone: body.phone,
        password: await hashPassword(body.password),
        role: "therapist",
        therapist_id: null,
        created_at: now,
        updated_at: now,
      },
    });

    const token = await createAccessToken(therapist);

    return jsonResponse(
      {
        user: serializeUser(therapist),
        token,
      },
      201
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }

    throw error;
  }
}

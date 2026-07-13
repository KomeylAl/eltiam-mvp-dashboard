import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/server/auth/password";
import {
  authenticateRequest,
  isTherapist,
  ownsPatient,
} from "@/lib/server/auth/request";
import {
  forbiddenResponse,
  jsonResponse,
  notFoundResponse,
  unauthenticatedResponse,
  validationErrorResponse,
} from "@/lib/server/http";
import { findPatientById } from "@/lib/server/patients";
import { serializePatient } from "@/lib/server/resources";
import { updatePatientSchema } from "@/lib/server/validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const therapist = await authenticateRequest(request);

  if (!therapist) {
    return unauthenticatedResponse();
  }

  if (!isTherapist(therapist)) {
    return forbiddenResponse();
  }

  const { id } = await params;
  const patient = await findPatientById(id);

  if (!patient || !ownsPatient(therapist, patient)) {
    return notFoundResponse();
  }

  return jsonResponse({ data: serializePatient(patient) });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const therapist = await authenticateRequest(request);

  if (!therapist) {
    return unauthenticatedResponse();
  }

  if (!isTherapist(therapist)) {
    return forbiddenResponse();
  }

  const { id } = await params;
  const patient = await findPatientById(id);

  if (!patient || !ownsPatient(therapist, patient)) {
    return notFoundResponse();
  }

  try {
    const body = updatePatientSchema.parse(await request.json());

    if (body.phone) {
      const existing = await prisma.user.findFirst({
        where: {
          phone: body.phone,
          NOT: { id: patient.id },
        },
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
    }

    const updated = await prisma.user.update({
      where: { id: patient.id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.phone !== undefined ? { phone: body.phone } : {}),
        ...(body.password !== undefined
          ? { password: await hashPassword(body.password) }
          : {}),
        updated_at: new Date(),
      },
    });

    return jsonResponse({ data: serializePatient(updated) });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }

    throw error;
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PUT(request, context);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const therapist = await authenticateRequest(request);

  if (!therapist) {
    return unauthenticatedResponse();
  }

  if (!isTherapist(therapist)) {
    return forbiddenResponse();
  }

  const { id } = await params;
  const patient = await findPatientById(id);

  if (!patient || !ownsPatient(therapist, patient)) {
    return notFoundResponse();
  }

  await prisma.user.delete({
    where: { id: patient.id },
  });

  return jsonResponse({ message: "Patient deleted successfully." });
}

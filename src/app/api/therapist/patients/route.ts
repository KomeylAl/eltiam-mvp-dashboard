import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/server/auth/password";
import {
  authenticateRequest,
  isTherapist,
} from "@/lib/server/auth/request";
import {
  forbiddenResponse,
  jsonResponse,
  unauthenticatedResponse,
  validationErrorResponse,
} from "@/lib/server/http";
import {
  buildPaginatedResponse,
  getPage,
  getPerPage,
} from "@/lib/server/pagination";
import { serializePatient } from "@/lib/server/resources";
import { storePatientSchema } from "@/lib/server/validation";

export async function GET(request: NextRequest) {
  const therapist = await authenticateRequest(request);

  if (!therapist) {
    return unauthenticatedResponse();
  }

  if (!isTherapist(therapist)) {
    return forbiddenResponse();
  }

  const page = getPage(request);
  const perPage = getPerPage(request);
  const skip = (page - 1) * perPage;

  const where = {
    therapist_id: therapist.id,
    role: "patient",
  };

  const [patients, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip,
      take: perPage,
    }),
    prisma.user.count({ where }),
  ]);

  return jsonResponse(
    buildPaginatedResponse(
      request,
      patients.map(serializePatient),
      total,
      page,
      perPage
    )
  );
}

export async function POST(request: NextRequest) {
  const therapist = await authenticateRequest(request);

  if (!therapist) {
    return unauthenticatedResponse();
  }

  if (!isTherapist(therapist)) {
    return forbiddenResponse();
  }

  try {
    const body = storePatientSchema.parse(await request.json());
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
    const patient = await prisma.user.create({
      data: {
        therapist_id: therapist.id,
        name: body.name,
        phone: body.phone,
        password: await hashPassword(body.password),
        role: "patient",
        created_at: now,
        updated_at: now,
      },
    });

    return jsonResponse({ data: serializePatient(patient) }, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }

    throw error;
  }
}

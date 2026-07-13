import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
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
} from "@/lib/server/http";
import {
  buildPaginatedResponse,
  getPage,
  getPerPage,
} from "@/lib/server/pagination";
import { findPatientById } from "@/lib/server/patients";
import { serializeIntervention } from "@/lib/server/resources";

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

  const page = getPage(request);
  const perPage = getPerPage(request);
  const skip = (page - 1) * perPage;
  const where = { user_id: patient.id };

  const [interventions, total] = await Promise.all([
    prisma.intervention.findMany({
      where,
      orderBy: [{ date: "desc" }, { time: "desc" }],
      skip,
      take: perPage,
    }),
    prisma.intervention.count({ where }),
  ]);

  return jsonResponse(
    buildPaginatedResponse(
      request,
      interventions.map(serializeIntervention),
      total,
      page,
      perPage
    )
  );
}

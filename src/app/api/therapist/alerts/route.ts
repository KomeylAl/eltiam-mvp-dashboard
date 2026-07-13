import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  authenticateRequest,
  isTherapist,
} from "@/lib/server/auth/request";
import {
  forbiddenResponse,
  jsonResponse,
  unauthenticatedResponse,
} from "@/lib/server/http";
import {
  buildPaginatedResponse,
  getPage,
  getPerPage,
} from "@/lib/server/pagination";
import { serializeRiskAlert } from "@/lib/server/resources";

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
    patient: {
      therapist_id: therapist.id,
    },
  };

  const [alerts, total] = await Promise.all([
    prisma.riskAlert.findMany({
      where,
      include: { patient: true },
      orderBy: { created_at: "desc" },
      skip,
      take: perPage,
    }),
    prisma.riskAlert.count({ where }),
  ]);

  return jsonResponse(
    buildPaginatedResponse(
      request,
      alerts.map((alert) => serializeRiskAlert(alert, alert.patient)),
      total,
      page,
      perPage
    )
  );
}

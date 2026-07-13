import type { Prisma, User } from "@prisma/client";

type RiskSourceType = "measurement" | "intervention";

type EvaluateRiskInput = {
  patient: User;
  qNumber: number;
  aNumber: number;
  sourceType: RiskSourceType;
  sourceId: bigint;
};

export async function evaluateAndCreateRiskAlert(
  tx: Prisma.TransactionClient,
  input: EvaluateRiskInput
): Promise<void> {
  if (input.qNumber !== 2 || input.aNumber < 3) {
    return;
  }

  const riskLevel = input.aNumber === 4 ? 4 : 3;
  const now = new Date();

  await tx.riskAlert.create({
    data: {
      patient_id: input.patient.id,
      source_type: input.sourceType,
      source_id: input.sourceId,
      risk_level: riskLevel,
      created_at: now,
      updated_at: now,
    },
  });
}

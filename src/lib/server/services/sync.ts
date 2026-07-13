import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseDate } from "@/lib/server/validation";
import { evaluateAndCreateRiskAlert } from "@/lib/server/services/risk-alert";

type AssessmentRecord = {
  date: string;
  time: string;
  q_number: number;
  a_number: number;
};

type SocialProblemRecord = {
  problem: string;
  reason?: string | null;
  solutions?: string | null;
  evaluations?: string | null;
  bestindex?: number | null;
  plan?: string | null;
  date: string;
  time: string;
};

type WordGameRecord = {
  point: number;
  date: string;
  time: string;
};

type SafetyPlanRecord = {
  question_one?: string | null;
  question_two?: string | null;
  thinking_feelings?: string | null;
  self_help?: string | null;
  others_help?: string | null;
  close_people_list?: string | null;
  close_friends_thoughts?: string | null;
  phone_calls?: string | null;
  protected_places?: string | null;
  date: string;
  time: string;
};

export async function syncMeasurements(
  user: User,
  records: AssessmentRecord[]
): Promise<number> {
  return prisma.$transaction(async (tx) => {
    let inserted = 0;

    for (const record of records) {
      const measurement = await tx.measurement.create({
        data: {
          user_id: user.id,
          date: parseDate(record.date),
          time: record.time,
          q_number: record.q_number,
          a_number: record.a_number,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      await evaluateAndCreateRiskAlert(tx, {
        patient: user,
        qNumber: record.q_number,
        aNumber: record.a_number,
        sourceType: "measurement",
        sourceId: measurement.id,
      });

      inserted++;
    }

    return inserted;
  });
}

export async function syncInterventions(
  user: User,
  records: AssessmentRecord[]
): Promise<number> {
  return prisma.$transaction(async (tx) => {
    let inserted = 0;

    for (const record of records) {
      const intervention = await tx.intervention.create({
        data: {
          user_id: user.id,
          date: parseDate(record.date),
          time: record.time,
          q_number: record.q_number,
          a_number: record.a_number,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      await evaluateAndCreateRiskAlert(tx, {
        patient: user,
        qNumber: record.q_number,
        aNumber: record.a_number,
        sourceType: "intervention",
        sourceId: intervention.id,
      });

      inserted++;
    }

    return inserted;
  });
}

export async function syncSocialProblems(
  user: User,
  records: SocialProblemRecord[]
): Promise<number> {
  return prisma.$transaction(async (tx) => {
    let inserted = 0;

    for (const record of records) {
      await tx.socialProblem.create({
        data: {
          user_id: user.id,
          problem: record.problem,
          reason: record.reason ?? null,
          solutions: record.solutions ?? null,
          evaluations: record.evaluations ?? null,
          bestindex: record.bestindex ?? null,
          plan: record.plan ?? null,
          date: parseDate(record.date),
          time: record.time,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      inserted++;
    }

    return inserted;
  });
}

export async function syncWordGames(
  user: User,
  records: WordGameRecord[]
): Promise<number> {
  return prisma.$transaction(async (tx) => {
    let inserted = 0;

    for (const record of records) {
      await tx.wordGame.create({
        data: {
          user_id: user.id,
          point: record.point,
          date: parseDate(record.date),
          time: record.time,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      inserted++;
    }

    return inserted;
  });
}

export async function syncSafetyPlans(
  user: User,
  records: SafetyPlanRecord[]
): Promise<number> {
  return prisma.$transaction(async (tx) => {
    let inserted = 0;

    for (const record of records) {
      await tx.safetyPlan.create({
        data: {
          user_id: user.id,
          question_one: record.question_one ?? null,
          question_two: record.question_two ?? null,
          thinking_feelings: record.thinking_feelings ?? null,
          self_help: record.self_help ?? null,
          others_help: record.others_help ?? null,
          close_people_list: record.close_people_list ?? null,
          close_friends_thoughts: record.close_friends_thoughts ?? null,
          phone_calls: record.phone_calls ?? null,
          protected_places: record.protected_places ?? null,
          date: parseDate(record.date),
          time: record.time,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      inserted++;
    }

    return inserted;
  });
}

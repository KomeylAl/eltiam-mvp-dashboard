import { z } from "zod";

const dateField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "The date field must be a valid date.");

const timeField = z.string().max(20);

const assessmentRecordSchema = z.object({
  date: dateField,
  time: timeField,
  q_number: z.coerce.number().int().min(0).max(2),
  a_number: z.coerce.number().int().min(0).max(4),
});

const interventionRecordSchema = assessmentRecordSchema;

export const loginSchema = z.object({
  phone: z.string().min(1).max(20),
  password: z.string().min(1),
});

export const registerTherapistSchema = z.object({
  name: z.string().min(1).max(255),
  phone: z.string().min(1).max(20),
  password: z.string().min(8),
});

export const storePatientSchema = z.object({
  name: z.string().min(1).max(255),
  phone: z.string().min(1).max(20),
  password: z.string().min(8),
});

export const updatePatientSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    phone: z.string().min(1).max(20).optional(),
    password: z.string().min(8).optional(),
  })
  .refine(
    (value) =>
      value.name !== undefined ||
      value.phone !== undefined ||
      value.password !== undefined,
    { message: "At least one field is required." }
  );

export const syncMeasurementsSchema = z.object({
  data: z.array(assessmentRecordSchema).min(1),
});

export const syncInterventionsSchema = z.object({
  data: z.array(interventionRecordSchema).min(1),
});

export const syncSocialProblemsSchema = z.object({
  data: z
    .array(
      z.object({
        problem: z.string().min(1),
        reason: z.string().nullable().optional(),
        solutions: z.string().nullable().optional(),
        evaluations: z.string().nullable().optional(),
        bestindex: z.number().int().nullable().optional(),
        plan: z.string().nullable().optional(),
        date: dateField,
        time: timeField,
      })
    )
    .min(1),
});

export const syncWordGamesSchema = z.object({
  data: z
    .array(
      z.object({
        point: z.number().int(),
        date: dateField,
        time: timeField,
      })
    )
    .min(1),
});

export const syncSafetyPlansSchema = z.object({
  data: z
    .array(
      z.object({
        question_one: z.string().nullable().optional(),
        question_two: z.string().nullable().optional(),
        thinking_feelings: z.string().nullable().optional(),
        self_help: z.string().nullable().optional(),
        others_help: z.string().nullable().optional(),
        close_people_list: z.string().nullable().optional(),
        close_friends_thoughts: z.string().nullable().optional(),
        phone_calls: z.string().nullable().optional(),
        protected_places: z.string().nullable().optional(),
        date: dateField,
        time: timeField,
      })
    )
    .min(1),
});

export function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

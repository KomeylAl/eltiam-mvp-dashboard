import { prisma } from "@/lib/prisma";

export async function findPatientById(patientId: string) {
  try {
    return prisma.user.findFirst({
      where: {
        id: BigInt(patientId),
        role: "patient",
      },
    });
  } catch {
    return null;
  }
}

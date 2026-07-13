import type { User } from "@prisma/client";
import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const TOKENABLE_TYPE = "App\\Models\\User";

function hashToken(plainText: string): string {
  return createHash("sha256").update(plainText).digest("hex");
}

function generatePlainTextToken(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = randomBytes(40);
  let token = "";

  for (let i = 0; i < 40; i++) {
    token += chars[bytes[i] % chars.length];
  }

  return token;
}

export async function createAccessToken(user: User): Promise<string> {
  const plainText = generatePlainTextToken();
  const now = new Date();

  const record = await prisma.personalAccessToken.create({
    data: {
      tokenable_type: TOKENABLE_TYPE,
      tokenable_id: user.id,
      name: "api-token",
      token: hashToken(plainText),
      abilities: null,
      created_at: now,
      updated_at: now,
    },
  });

  return `${record.id}|${plainText}`;
}

export async function findUserByAccessToken(
  bearerToken: string
): Promise<User | null> {
  const separatorIndex = bearerToken.indexOf("|");

  if (separatorIndex === -1) {
    return null;
  }

  const id = bearerToken.slice(0, separatorIndex);
  const plainText = bearerToken.slice(separatorIndex + 1);

  if (!id || !plainText) {
    return null;
  }

  const tokenRecord = await prisma.personalAccessToken.findUnique({
    where: { id: BigInt(id) },
  });

  if (!tokenRecord) {
    return null;
  }

  if (tokenRecord.tokenable_type !== TOKENABLE_TYPE) {
    return null;
  }

  if (tokenRecord.token !== hashToken(plainText)) {
    return null;
  }

  if (tokenRecord.expires_at && tokenRecord.expires_at < new Date()) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: tokenRecord.tokenable_id },
  });

  if (!user) {
    return null;
  }

  await prisma.personalAccessToken.update({
    where: { id: tokenRecord.id },
    data: { last_used_at: new Date(), updated_at: new Date() },
  });

  return user;
}

export async function revokeAccessToken(bearerToken: string): Promise<void> {
  const separatorIndex = bearerToken.indexOf("|");

  if (separatorIndex === -1) {
    return;
  }

  const id = bearerToken.slice(0, separatorIndex);

  if (!id) {
    return;
  }

  await prisma.personalAccessToken.deleteMany({
    where: { id: BigInt(id) },
  });
}

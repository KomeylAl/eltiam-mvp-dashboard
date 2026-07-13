import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const normalizedHash = hashedPassword.replace(/^\$2y\$/, "$2a$");
  return bcrypt.compare(password, normalizedHash);
}

import "server-only";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// Generates a readable temporary password, e.g. "tigre-forja-8421".
export function generateTempPassword(): string {
  const words = ["tigre", "forja", "cedro", "ola", "brisa", "roble", "faro", "lince", "nova", "rio"];
  const w1 = words[Math.floor(Math.random() * words.length)];
  const w2 = words[Math.floor(Math.random() * words.length)];
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `${w1}-${w2}-${digits}`;
}

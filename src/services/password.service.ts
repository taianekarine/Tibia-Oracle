import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  console.log("[AUTH][HASH] Gerando hash da senha");
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  console.log("[AUTH][HASH] Comparando senha");
  return bcrypt.compare(password, hash);
}

import { hash, verify } from "@node-rs/argon2";

// Argon2id with conservative parameters. Passwords are low-entropy, so they need
// a slow, memory-hard KDF (unlike the high-entropy random tokens elsewhere,
// which a fast SHA-256 covers).
const OPTIONS = {
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
} as const;

export function hashPassword(password: string): Promise<string> {
  return hash(password, OPTIONS);
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  try {
    return await verify(passwordHash, password, OPTIONS);
  } catch {
    // A malformed stored hash should read as "wrong password", not a crash.
    return false;
  }
}

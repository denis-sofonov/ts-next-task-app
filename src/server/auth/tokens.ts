import { createHash, randomBytes } from "node:crypto";
import { and, eq, lt } from "drizzle-orm";
import { db } from "@/server/db";
import { authTokens } from "@/server/db/schema";

export type AuthTokenType = "email_verification" | "password_reset";

export const TOKEN_TTL = {
  email_verification: 1000 * 60 * 60 * 24, // 24 hours
  password_reset: 1000 * 60 * 30, // 30 minutes
} as const satisfies Record<AuthTokenType, number>;

// High-entropy random tokens, so a fast hash is sufficient and lets us look them
// up by hash. Only the hash is stored: a database leak exposes no usable link.
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Issue a single-use token, returning the plaintext to embed in an email link. */
export async function createAuthToken(userId: string, type: AuthTokenType): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TOKEN_TTL[type]);

  // Only one live token of each type per user: drop any previous one first.
  await db.delete(authTokens).where(and(eq(authTokens.userId, userId), eq(authTokens.type, type)));
  await db.insert(authTokens).values({ userId, type, tokenHash: hashToken(token), expiresAt });

  return token;
}

/**
 * Validate and consume a token. Returns the owning user id, or null if the token
 * is unknown, of the wrong type or expired. Consuming deletes the row, so a token
 * works exactly once.
 */
export async function consumeAuthToken(type: AuthTokenType, token: string): Promise<string | null> {
  const tokenHash = hashToken(token);
  const [row] = await db
    .select()
    .from(authTokens)
    .where(and(eq(authTokens.tokenHash, tokenHash), eq(authTokens.type, type)))
    .limit(1);

  if (!row) return null;

  await db.delete(authTokens).where(eq(authTokens.id, row.id));

  if (row.expiresAt.getTime() <= Date.now()) return null;
  return row.userId;
}

/** Remove every expired token. Run on a schedule (see tasks/cleanup-tokens). */
export async function deleteExpiredTokens(): Promise<number> {
  const deleted = await db
    .delete(authTokens)
    .where(lt(authTokens.expiresAt, new Date()))
    .returning({ id: authTokens.id });
  return deleted.length;
}

import { createHmac, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/server/db";
import { sessions, type User, users } from "@/server/db/schema";
import { env } from "@/server/env";
import { unauthorized } from "@/server/http/api-error";

export const SESSION_COOKIE = "session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

// The cookie carries `<sessionId>.<hmac>`. The HMAC lets us reject a tampered or
// forged id before touching the database; the id itself is the source of truth.
function sign(sessionId: string): string {
  const mac = createHmac("sha256", env.SESSION_SECRET).update(sessionId).digest("base64url");
  return `${sessionId}.${mac}`;
}

function unsign(signed: string): string | null {
  const dot = signed.lastIndexOf(".");
  if (dot < 0) return null;
  const sessionId = signed.slice(0, dot);
  const provided = signed.slice(dot + 1);
  const expected = createHmac("sha256", env.SESSION_SECRET).update(sessionId).digest("base64url");
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return sessionId;
}

/** Create a session row and set the signed cookie. Call from a route handler or action. */
export async function createSession(userId: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const [row] = await db.insert(sessions).values({ userId, expiresAt }).returning();

  const jar = await cookies();
  jar.set(SESSION_COOKIE, sign(row!.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: env.COOKIE_SECURE,
    path: "/",
    expires: expiresAt,
  });
}

/** Resolve the signed-in user from the cookie, or null. Safe in Server Components. */
export async function getSessionUser(): Promise<User | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const sessionId = unsign(raw);
  if (!sessionId) return null;

  const [row] = await db
    .select({ user: users, expiresAt: sessions.expiresAt })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!row) return null;
  if (row.expiresAt.getTime() <= Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }
  return row.user;
}

/** Same as `getSessionUser`, but throws a 401 when there is no valid session. */
export async function requireUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) throw unauthorized("Authentication required");
  return user;
}

/** Delete the current session row and clear the cookie. */
export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (raw) {
    const sessionId = unsign(raw);
    if (sessionId) await db.delete(sessions).where(eq(sessions.id, sessionId));
  }
  jar.delete(SESSION_COOKIE);
}

/** Revoke every session for a user (used on password reset). */
export async function revokeUserSessions(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

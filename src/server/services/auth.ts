import { eq, sql } from "drizzle-orm";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { revokeUserSessions } from "@/server/auth/session";
import { consumeAuthToken, createAuthToken } from "@/server/auth/tokens";
import { db } from "@/server/db";
import { type User, users } from "@/server/db/schema";
import { conflict, unauthorized } from "@/server/http/api-error";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/server/mailer";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "@/shared/schemas/auth";

function findByEmail(email: string) {
  // Case-insensitive lookup mirrors the case-insensitive unique index.
  return db
    .select()
    .from(users)
    .where(eq(sql`lower(${users.email})`, email.toLowerCase()))
    .limit(1);
}

export async function register(input: RegisterInput): Promise<User> {
  const passwordHash = await hashPassword(input.password);

  let user: User;
  try {
    const [created] = await db
      .insert(users)
      .values({ email: input.email, name: input.name, passwordHash })
      .returning();
    user = created!;
  } catch (error) {
    // Unique violation on the email index -> 409 rather than a 500.
    if (error instanceof Error && "code" in error && error.code === "23505") {
      throw conflict("An account with this email already exists");
    }
    throw error;
  }

  const token = await createAuthToken(user.id, "email_verification");
  await sendVerificationEmail(user.email, token);
  return user;
}

// A valid argon2id hash (of a random throwaway password) used when no account
// exists, so the verify still runs at full cost and a missing account takes the
// same time as a wrong password — closing the user-enumeration timing channel.
const DUMMY_PASSWORD_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$8pBhnldxIxUtGjweyEGouA$lWeJzVSXxVIOypc/55EKwP9c/uuSuqJG004EPuo07Z0";

export async function login(input: LoginInput): Promise<User> {
  const [user] = await findByEmail(input.email);
  const ok = await verifyPassword(user?.passwordHash ?? DUMMY_PASSWORD_HASH, input.password);

  if (!user || !ok) throw unauthorized("Invalid email or password");
  return user;
}

export async function verifyEmail(token: string): Promise<void> {
  const userId = await consumeAuthToken("email_verification", token);
  if (!userId) throw unauthorized("Invalid or expired verification link");
  await db.update(users).set({ emailVerifiedAt: new Date() }).where(eq(users.id, userId));
}

// The next three intentionally always resolve successfully, regardless of
// whether the address exists, so they can't be used to probe for accounts.
export async function resendVerification(email: string): Promise<void> {
  const [user] = await findByEmail(email);
  if (user && !user.emailVerifiedAt) {
    const token = await createAuthToken(user.id, "email_verification");
    await sendVerificationEmail(user.email, token);
  }
}

export async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  const [user] = await findByEmail(input.email);
  if (user) {
    const token = await createAuthToken(user.id, "password_reset");
    await sendPasswordResetEmail(user.email, token);
  }
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const userId = await consumeAuthToken("password_reset", input.token);
  if (!userId) throw unauthorized("Invalid or expired reset link");

  const passwordHash = await hashPassword(input.password);
  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
  // A reset invalidates every existing session.
  await revokeUserSessions(userId);
}

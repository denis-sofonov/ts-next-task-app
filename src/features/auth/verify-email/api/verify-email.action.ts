"use server";

import { requireUser } from "@/server/auth/session";
import { toFormState } from "@/server/http/form";
import { parseInput } from "@/server/http/validation";
import { resendVerification, verifyEmail } from "@/server/services/auth";
import type { FormState } from "@/shared/lib/form";
import { verifyEmailSchema } from "@/shared/schemas/auth";

export async function verifyEmailAction(token: string): Promise<FormState> {
  try {
    const input = parseInput(verifyEmailSchema, { token });
    await verifyEmail(input.token);
  } catch (error) {
    return toFormState(error);
  }
  return { status: "success", message: "Your email is verified." };
}

export async function resendVerificationForCurrentUser(): Promise<FormState> {
  try {
    const user = await requireUser();
    await resendVerification(user.email);
  } catch (error) {
    return toFormState(error);
  }
  return { status: "success", message: "Verification email sent." };
}

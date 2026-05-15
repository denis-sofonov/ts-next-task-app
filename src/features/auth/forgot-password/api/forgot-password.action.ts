"use server";

import { toFormState } from "@/server/http/form";
import { parseInput } from "@/server/http/validation";
import { forgotPassword } from "@/server/services/auth";
import type { FormState } from "@/shared/lib/form";
import { forgotPasswordSchema } from "@/shared/schemas/auth";

export async function forgotPasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const input = parseInput(forgotPasswordSchema, { email: formData.get("email") });
    await forgotPassword(input);
  } catch (error) {
    return toFormState(error);
  }
  return {
    status: "success",
    message: "If that email exists, a reset link is on its way.",
  };
}

"use server";

import { redirect } from "next/navigation";
import { toFormState } from "@/server/http/form";
import { parseInput } from "@/server/http/validation";
import { resetPassword } from "@/server/services/auth";
import { routes } from "@/shared/config/routes";
import type { FormState } from "@/shared/lib/form";
import { resetPasswordSchema } from "@/shared/schemas/auth";

export async function resetPasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const input = parseInput(resetPasswordSchema, {
      token: formData.get("token"),
      password: formData.get("password"),
    });
    await resetPassword(input);
  } catch (error) {
    return toFormState(error);
  }
  redirect(`${routes.login}?reset=1`);
}

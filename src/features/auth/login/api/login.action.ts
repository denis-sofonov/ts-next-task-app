"use server";

import { redirect } from "next/navigation";
import { createSession } from "@/server/auth/session";
import { toFormState } from "@/server/http/form";
import { parseInput } from "@/server/http/validation";
import { login } from "@/server/services/auth";
import { routes } from "@/shared/config/routes";
import type { FormState } from "@/shared/lib/form";
import { loginSchema } from "@/shared/schemas/auth";

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const input = parseInput(loginSchema, {
      email: formData.get("email"),
      password: formData.get("password"),
    });
    const user = await login(input);
    await createSession(user.id);
  } catch (error) {
    return toFormState(error);
  }
  // `redirect` throws internally, so it must run outside the try/catch.
  redirect(routes.projects);
}

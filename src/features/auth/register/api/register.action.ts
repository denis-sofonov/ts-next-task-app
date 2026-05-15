"use server";

import { redirect } from "next/navigation";
import { createSession } from "@/server/auth/session";
import { toFormState } from "@/server/http/form";
import { parseInput } from "@/server/http/validation";
import { register } from "@/server/services/auth";
import { routes } from "@/shared/config/routes";
import type { FormState } from "@/shared/lib/form";
import { registerSchema } from "@/shared/schemas/auth";

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const input = parseInput(registerSchema, {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });
    const user = await register(input);
    await createSession(user.id);
  } catch (error) {
    return toFormState(error);
  }
  redirect(routes.projects);
}

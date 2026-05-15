"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/server/auth/session";
import { toFormState } from "@/server/http/form";
import { parseInput } from "@/server/http/validation";
import { createProject, deleteProject, updateProject } from "@/server/services/projects";
import { invalidateStats } from "@/server/services/stats";
import { routes } from "@/shared/config/routes";
import { type FormState, optionalText } from "@/shared/lib/form";
import { createProjectSchema, updateProjectSchema } from "@/shared/schemas/project";

export async function createProjectAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const user = await requireUser();
    const input = parseInput(createProjectSchema, {
      name: formData.get("name"),
      description: optionalText(formData.get("description")) ?? null,
    });
    await createProject(user.id, input);
    invalidateStats(user.id);
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(routes.projects);
  return { status: "success" };
}

export async function updateProjectAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = String(formData.get("id"));
  try {
    const user = await requireUser();
    const input = parseInput(updateProjectSchema, {
      name: formData.get("name"),
      description: optionalText(formData.get("description")) ?? null,
    });
    await updateProject(user.id, id, input);
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(routes.projects);
  revalidatePath(routes.project(id));
  return { status: "success" };
}

export async function deleteProjectAction(id: string): Promise<FormState> {
  try {
    const user = await requireUser();
    await deleteProject(user.id, id);
    invalidateStats(user.id);
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(routes.projects);
  return { status: "success" };
}

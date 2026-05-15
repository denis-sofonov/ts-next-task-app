"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/server/auth/session";
import { toFormState } from "@/server/http/form";
import { parseInput } from "@/server/http/validation";
import { invalidateStats } from "@/server/services/stats";
import { createTask, deleteTask, updateTask } from "@/server/services/tasks";
import { routes } from "@/shared/config/routes";
import { type FormState, optionalText } from "@/shared/lib/form";
import { createTaskSchema, updateTaskSchema } from "@/shared/schemas/task";

export async function createTaskAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const projectId = String(formData.get("projectId"));
  try {
    const user = await requireUser();
    const input = parseInput(createTaskSchema, {
      title: formData.get("title"),
      description: optionalText(formData.get("description")) ?? null,
      status: formData.get("status") ?? undefined,
    });
    await createTask(user.id, projectId, input);
    invalidateStats(user.id);
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(routes.project(projectId));
  return { status: "success" };
}

export async function updateTaskAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const projectId = String(formData.get("projectId"));
  const taskId = String(formData.get("taskId"));
  try {
    const user = await requireUser();
    const input = parseInput(updateTaskSchema, {
      title: formData.get("title"),
      description: optionalText(formData.get("description")) ?? null,
      status: formData.get("status") ?? undefined,
    });
    await updateTask(user.id, projectId, taskId, input);
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(routes.project(projectId));
  return { status: "success" };
}

export async function deleteTaskAction(projectId: string, taskId: string): Promise<FormState> {
  try {
    const user = await requireUser();
    await deleteTask(user.id, projectId, taskId);
    invalidateStats(user.id);
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(routes.project(projectId));
  return { status: "success" };
}

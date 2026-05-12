import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/server/db";
import { type Project, projects, type Task, tasks } from "@/server/db/schema";
import { forbidden, notFound } from "@/server/http/api-error";

const uuid = z.uuid();

/** Treat a non-UUID id as "not found" rather than leaking a 400/500. */
export function assertUuid(value: string, label = "resource"): string {
  const result = uuid.safeParse(value);
  if (!result.success) throw notFound(`${label} not found`);
  return result.data;
}

/**
 * Load a project and assert `userId` owns it.
 *
 * Missing -> 404, owned by someone else -> 403. The 403 deliberately confirms
 * existence (per the project's access spec); a stricter design would return 404
 * in both cases to avoid disclosing that the id exists.
 */
export async function requireOwnedProject(userId: string, projectId: string): Promise<Project> {
  const id = assertUuid(projectId, "Project");
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

  if (!project) throw notFound("Project not found");
  if (project.userId !== userId) throw forbidden();
  return project;
}

/** Load a task scoped to a project the user owns. */
export async function requireOwnedTask(
  userId: string,
  projectId: string,
  taskId: string,
): Promise<{ task: Task; project: Project }> {
  const project = await requireOwnedProject(userId, projectId);
  const id = assertUuid(taskId, "Task");

  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.projectId, project.id)))
    .limit(1);

  if (!task) throw notFound("Task not found");
  return { task, project };
}

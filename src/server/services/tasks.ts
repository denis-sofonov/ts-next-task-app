import { and, asc, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/server/db";
import { tasks } from "@/server/db/schema";
import { toTaskDto } from "@/server/dto";
import { requireOwnedProject, requireOwnedTask } from "@/server/ownership";
import { buildPageMeta, pageOffset } from "@/server/pagination";
import type { TaskListQuery } from "@/shared/schemas/list-query";
import type { CreateTaskInput, UpdateTaskInput } from "@/shared/schemas/task";
import type { Paginated } from "@/shared/types/api";
import type { TaskDto } from "@/shared/types/domain";

const SORT_COLUMNS = {
  createdAt: tasks.createdAt,
  updatedAt: tasks.updatedAt,
  title: tasks.title,
  status: tasks.status,
} as const;

export async function listTasks(
  userId: string,
  projectId: string,
  query: TaskListQuery,
): Promise<Paginated<TaskDto>> {
  // Ownership of the parent project gates access to all of its tasks.
  const project = await requireOwnedProject(userId, projectId);

  const filters: SQL[] = [eq(tasks.projectId, project.id)];
  if (query.status) filters.push(eq(tasks.status, query.status));
  if (query.search) {
    const term = `%${query.search}%`;
    filters.push(or(ilike(tasks.title, term), ilike(tasks.description, term))!);
  }
  const where = and(...filters);

  const orderColumn = SORT_COLUMNS[query.sort];
  const orderBy = query.order === "asc" ? asc(orderColumn) : desc(orderColumn);

  const [rows, [totals]] = await Promise.all([
    db
      .select()
      .from(tasks)
      .where(where)
      .orderBy(orderBy)
      .limit(query.limit)
      .offset(pageOffset(query.page, query.limit)),
    db.select({ value: count() }).from(tasks).where(where),
  ]);

  return {
    data: rows.map(toTaskDto),
    meta: buildPageMeta(query.page, query.limit, totals?.value ?? 0),
  };
}

export async function getTask(userId: string, projectId: string, taskId: string): Promise<TaskDto> {
  const { task } = await requireOwnedTask(userId, projectId, taskId);
  return toTaskDto(task);
}

export async function createTask(
  userId: string,
  projectId: string,
  input: CreateTaskInput,
): Promise<TaskDto> {
  const project = await requireOwnedProject(userId, projectId);
  const [task] = await db
    .insert(tasks)
    .values({
      projectId: project.id,
      title: input.title,
      description: input.description ?? null,
      status: input.status,
    })
    .returning();
  return toTaskDto(task!);
}

export async function updateTask(
  userId: string,
  projectId: string,
  taskId: string,
  input: UpdateTaskInput,
): Promise<TaskDto> {
  const { task: existing } = await requireOwnedTask(userId, projectId, taskId);

  const [task] = await db
    .update(tasks)
    .set({
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description ?? null }),
      ...(input.status !== undefined && { status: input.status }),
    })
    .where(eq(tasks.id, existing.id))
    .returning();
  return toTaskDto(task!);
}

export async function deleteTask(userId: string, projectId: string, taskId: string): Promise<void> {
  const { task } = await requireOwnedTask(userId, projectId, taskId);
  await db.delete(tasks).where(eq(tasks.id, task.id));
}

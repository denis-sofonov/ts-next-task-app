import { and, asc, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/server/db";
import { projects } from "@/server/db/schema";
import { toProjectDto } from "@/server/dto";
import { requireOwnedProject } from "@/server/ownership";
import { buildPageMeta, pageOffset } from "@/server/pagination";
import type { ProjectListQuery } from "@/shared/schemas/list-query";
import type { CreateProjectInput, UpdateProjectInput } from "@/shared/schemas/project";
import type { Paginated } from "@/shared/types/api";
import type { ProjectDto } from "@/shared/types/domain";

const SORT_COLUMNS = {
  createdAt: projects.createdAt,
  updatedAt: projects.updatedAt,
  name: projects.name,
} as const;

export async function listProjects(
  userId: string,
  query: ProjectListQuery,
): Promise<Paginated<ProjectDto>> {
  const filters: SQL[] = [eq(projects.userId, userId)];
  if (query.search) {
    const term = `%${query.search}%`;
    filters.push(or(ilike(projects.name, term), ilike(projects.description, term))!);
  }
  const where = and(...filters);

  const orderColumn = SORT_COLUMNS[query.sort];
  const orderBy = query.order === "asc" ? asc(orderColumn) : desc(orderColumn);

  const [rows, [totals]] = await Promise.all([
    db
      .select()
      .from(projects)
      .where(where)
      .orderBy(orderBy)
      .limit(query.limit)
      .offset(pageOffset(query.page, query.limit)),
    db.select({ value: count() }).from(projects).where(where),
  ]);

  return {
    data: rows.map(toProjectDto),
    meta: buildPageMeta(query.page, query.limit, totals?.value ?? 0),
  };
}

export async function getProject(userId: string, projectId: string): Promise<ProjectDto> {
  return toProjectDto(await requireOwnedProject(userId, projectId));
}

export async function createProject(
  userId: string,
  input: CreateProjectInput,
): Promise<ProjectDto> {
  const [project] = await db
    .insert(projects)
    .values({ userId, name: input.name, description: input.description ?? null })
    .returning();
  return toProjectDto(project!);
}

export async function updateProject(
  userId: string,
  projectId: string,
  input: UpdateProjectInput,
): Promise<ProjectDto> {
  const existing = await requireOwnedProject(userId, projectId);

  const [project] = await db
    .update(projects)
    .set({
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description ?? null }),
    })
    .where(eq(projects.id, existing.id))
    .returning();
  return toProjectDto(project!);
}

export async function deleteProject(userId: string, projectId: string): Promise<void> {
  const existing = await requireOwnedProject(userId, projectId);
  await db.delete(projects).where(eq(projects.id, existing.id));
}

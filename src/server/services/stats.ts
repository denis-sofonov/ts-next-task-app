import { count, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { projects, tasks } from "@/server/db/schema";
import { TASK_STATUSES, type TaskStatus } from "@/shared/constants/task-status";
import type { StatsDto } from "@/shared/types/domain";

// Per-user stats are cheap to compute but hit on every dashboard load, so cache
// them briefly in memory. Writes invalidate the entry so numbers never look
// stale right after a change.
const CACHE_TTL_MS = 1000 * 30;
const cache = new Map<string, { value: StatsDto; expiresAt: number }>();

export function invalidateStats(userId: string): void {
  cache.delete(userId);
}

export async function getStats(userId: string): Promise<StatsDto> {
  const cached = cache.get(userId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const [[projectTotals], statusRows] = await Promise.all([
    db.select({ value: count() }).from(projects).where(eq(projects.userId, userId)),
    db
      .select({ status: tasks.status, value: count() })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(eq(projects.userId, userId))
      .groupBy(tasks.status),
  ]);

  const tasksByStatus = Object.fromEntries(TASK_STATUSES.map((s) => [s, 0])) as Record<
    TaskStatus,
    number
  >;
  let tasksTotal = 0;
  for (const row of statusRows) {
    tasksByStatus[row.status] = row.value;
    tasksTotal += row.value;
  }

  const value: StatsDto = {
    projects: projectTotals?.value ?? 0,
    tasks: tasksTotal,
    tasksByStatus,
  };
  cache.set(userId, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  return value;
}

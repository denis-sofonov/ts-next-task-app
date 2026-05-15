import { listTasks as listTasksService } from "@/server/services/tasks";
import type { SearchParams } from "@/shared/lib/search-params";
import { taskListQuerySchema } from "@/shared/schemas/list-query";

export async function getTasks(userId: string, projectId: string, searchParams: SearchParams) {
  const query = taskListQuerySchema.parse(searchParams);
  return listTasksService(userId, projectId, query);
}

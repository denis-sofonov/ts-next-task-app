import { z } from "zod";
import { paginationSchema } from "./pagination";
import { taskStatusSchema } from "./task";

const sortOrder = z.enum(["asc", "desc"]).catch("desc").default("desc");
const search = z.string().trim().max(200).optional();

// Sort fields are whitelisted so a client can never order by an arbitrary
// column. The value maps to a real column inside the service layer.
export const PROJECT_SORT_FIELDS = ["createdAt", "updatedAt", "name"] as const;
export const TASK_SORT_FIELDS = ["createdAt", "updatedAt", "title", "status"] as const;

export const projectListQuerySchema = paginationSchema.extend({
  search,
  sort: z.enum(PROJECT_SORT_FIELDS).catch("createdAt").default("createdAt"),
  order: sortOrder,
});

export const taskListQuerySchema = paginationSchema.extend({
  search,
  status: taskStatusSchema.optional(),
  sort: z.enum(TASK_SORT_FIELDS).catch("createdAt").default("createdAt"),
  order: sortOrder,
});

export type ProjectListQuery = z.infer<typeof projectListQuerySchema>;
export type TaskListQuery = z.infer<typeof taskListQuerySchema>;

// The set of task statuses, declared once as a readonly tuple so it can drive
// the Drizzle enum, the Zod schemas and the TypeScript union without drifting.
export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

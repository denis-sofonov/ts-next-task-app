import { TASK_STATUS_LABELS, type TaskStatus } from "@/shared/constants/task-status";
import { Badge } from "@/shared/ui/badge";

const VARIANT: Record<TaskStatus, "secondary" | "default" | "outline"> = {
  todo: "outline",
  in_progress: "secondary",
  done: "default",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <Badge variant={VARIANT[status]}>{TASK_STATUS_LABELS[status]}</Badge>;
}

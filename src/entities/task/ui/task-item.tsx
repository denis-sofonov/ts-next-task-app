import type { ReactNode } from "react";
import type { TaskDto } from "@/shared/types/domain";
import { StatusBadge } from "./status-badge";

export function TaskItem({ task, actions }: { task: TaskDto; actions?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <StatusBadge status={task.status} />
          <p className="truncate font-medium">{task.title}</p>
        </div>
        {task.description ? (
          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

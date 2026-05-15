import { TaskItem } from "@/entities/task";
import { TaskActions } from "@/features/task/manage-task";
import type { Paginated } from "@/shared/types/api";
import type { TaskDto } from "@/shared/types/domain";
import { EmptyState } from "@/shared/ui/empty-state";
import { Pagination } from "@/shared/ui/pagination";

export function TaskList({ tasks, filtered }: { tasks: Paginated<TaskDto>; filtered: boolean }) {
  if (tasks.data.length === 0) {
    return (
      <EmptyState
        title={filtered ? "No matching tasks" : "No tasks yet"}
        description={filtered ? "Adjust the filters above." : "Add the first task to this project."}
      />
    );
  }

  return (
    <div className="space-y-3">
      {tasks.data.map((task) => (
        <TaskItem key={task.id} task={task} actions={<TaskActions task={task} />} />
      ))}
      <Pagination page={tasks.meta.page} totalPages={tasks.meta.totalPages} />
    </div>
  );
}

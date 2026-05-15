import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { findProjectOrNotFound } from "@/entities/project";
import { getTasks } from "@/entities/task";
import { requireAuth } from "@/entities/user";
import { ProjectActions } from "@/features/project/manage-project";
import { TaskFilters } from "@/features/task/filter-tasks";
import { CreateTaskButton } from "@/features/task/manage-task";
import { routes } from "@/shared/config/routes";
import type { SearchParams } from "@/shared/lib/search-params";
import { TaskList } from "@/widgets/task-list";

export async function ProjectDetailsPage({
  projectId,
  searchParams,
}: {
  projectId: string;
  searchParams: SearchParams;
}) {
  const user = await requireAuth();
  const project = await findProjectOrNotFound(user.id, projectId);
  const tasks = await getTasks(user.id, projectId, searchParams);

  return (
    <div className="space-y-6">
      <Link
        href={routes.projects}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeftIcon className="size-4" />
        Projects
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          {project.description ? (
            <p className="text-muted-foreground">{project.description}</p>
          ) : null}
        </div>
        <ProjectActions project={project} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TaskFilters />
        <CreateTaskButton projectId={project.id} />
      </div>

      <TaskList tasks={tasks} filtered={Boolean(searchParams.search || searchParams.status)} />
    </div>
  );
}

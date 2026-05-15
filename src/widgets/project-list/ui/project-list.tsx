import { ProjectCard } from "@/entities/project";
import { ProjectActions } from "@/features/project/manage-project";
import type { Paginated } from "@/shared/types/api";
import type { ProjectDto } from "@/shared/types/domain";
import { EmptyState } from "@/shared/ui/empty-state";
import { Pagination } from "@/shared/ui/pagination";

export function ProjectList({
  projects,
  searching,
}: {
  projects: Paginated<ProjectDto>;
  searching: boolean;
}) {
  if (projects.data.length === 0) {
    return (
      <EmptyState
        title={searching ? "No matching projects" : "No projects yet"}
        description={
          searching
            ? "Try a different search term."
            : "Create your first project to start organising tasks."
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.data.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            actions={<ProjectActions project={project} />}
          />
        ))}
      </div>
      <Pagination page={projects.meta.page} totalPages={projects.meta.totalPages} />
    </div>
  );
}

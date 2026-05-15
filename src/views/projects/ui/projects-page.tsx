import { getProjects } from "@/entities/project";
import { requireAuth } from "@/entities/user";
import { ProjectFilters } from "@/features/project/filter-projects";
import { CreateProjectButton } from "@/features/project/manage-project";
import type { SearchParams } from "@/shared/lib/search-params";
import { ProjectList } from "@/widgets/project-list";

export async function ProjectsPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireAuth();
  const projects = await getProjects(user.id, searchParams);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground">{projects.meta.total} total</p>
        </div>
        <CreateProjectButton />
      </div>
      <ProjectFilters />
      <ProjectList projects={projects} searching={Boolean(searchParams.search)} />
    </div>
  );
}

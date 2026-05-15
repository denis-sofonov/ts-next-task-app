import type { SearchParams } from "@/shared/lib/search-params";
import { ProjectsPage } from "@/views/projects";

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <ProjectsPage searchParams={await searchParams} />;
}

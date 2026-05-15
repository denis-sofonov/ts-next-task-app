import type { SearchParams } from "@/shared/lib/search-params";
import { ProjectDetailsPage } from "@/views/project-details";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  return <ProjectDetailsPage projectId={id} searchParams={await searchParams} />;
}

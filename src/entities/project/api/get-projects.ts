import { notFound } from "next/navigation";
import { ApiError } from "@/server/http/api-error";
import {
  getProject as getProjectService,
  listProjects as listProjectsService,
} from "@/server/services/projects";
import type { SearchParams } from "@/shared/lib/search-params";
import { projectListQuerySchema } from "@/shared/schemas/list-query";

// Entity-level read API: the FSD boundary the UI layers import, wrapping the
// backend service so views never reach into `src/server` directly.
export async function getProjects(userId: string, searchParams: SearchParams) {
  // The list-query schema carries `.catch`/`.default`, so malformed query values
  // fall back to sane defaults instead of throwing.
  const query = projectListQuerySchema.parse(searchParams);
  return listProjectsService(userId, query);
}

export function getProject(userId: string, projectId: string) {
  return getProjectService(userId, projectId);
}

// For Server Components: a missing or non-owned project renders the 404 page
// instead of throwing into the error boundary.
export async function findProjectOrNotFound(userId: string, projectId: string) {
  try {
    return await getProjectService(userId, projectId);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) notFound();
    throw error;
  }
}

import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { withApiHandler } from "@/server/http/handler";
import { parseBody, parseQuery } from "@/server/http/validation";
import { createProject, listProjects } from "@/server/services/projects";
import { invalidateStats } from "@/server/services/stats";
import { projectListQuerySchema } from "@/shared/schemas/list-query";
import { createProjectSchema } from "@/shared/schemas/project";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withApiHandler(async (req) => {
  const user = await requireUser();
  const query = parseQuery(req, projectListQuerySchema);
  return NextResponse.json(await listProjects(user.id, query));
});

export const POST = withApiHandler(async (req) => {
  const user = await requireUser();
  const input = await parseBody(req, createProjectSchema);
  const project = await createProject(user.id, input);
  invalidateStats(user.id);
  return NextResponse.json(project, { status: 201 });
});

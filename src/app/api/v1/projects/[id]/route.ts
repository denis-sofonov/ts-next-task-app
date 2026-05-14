import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { withApiHandler } from "@/server/http/handler";
import { parseBody } from "@/server/http/validation";
import { deleteProject, getProject, updateProject } from "@/server/services/projects";
import { invalidateStats } from "@/server/services/stats";
import { updateProjectSchema } from "@/shared/schemas/project";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { id: string };

export const GET = withApiHandler<Params>(async (_req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  return NextResponse.json(await getProject(user.id, id));
});

export const PATCH = withApiHandler<Params>(async (req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const input = await parseBody(req, updateProjectSchema);
  return NextResponse.json(await updateProject(user.id, id, input));
});

export const DELETE = withApiHandler<Params>(async (_req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  await deleteProject(user.id, id);
  invalidateStats(user.id);
  return new NextResponse(null, { status: 204 });
});

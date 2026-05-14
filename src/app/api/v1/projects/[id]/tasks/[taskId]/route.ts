import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { withApiHandler } from "@/server/http/handler";
import { parseBody } from "@/server/http/validation";
import { invalidateStats } from "@/server/services/stats";
import { deleteTask, getTask, updateTask } from "@/server/services/tasks";
import { updateTaskSchema } from "@/shared/schemas/task";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { id: string; taskId: string };

export const GET = withApiHandler<Params>(async (_req, { params }) => {
  const user = await requireUser();
  const { id, taskId } = await params;
  return NextResponse.json(await getTask(user.id, id, taskId));
});

export const PATCH = withApiHandler<Params>(async (req, { params }) => {
  const user = await requireUser();
  const { id, taskId } = await params;
  const input = await parseBody(req, updateTaskSchema);
  const task = await updateTask(user.id, id, taskId, input);
  invalidateStats(user.id);
  return NextResponse.json(task);
});

export const DELETE = withApiHandler<Params>(async (_req, { params }) => {
  const user = await requireUser();
  const { id, taskId } = await params;
  await deleteTask(user.id, id, taskId);
  invalidateStats(user.id);
  return new NextResponse(null, { status: 204 });
});

import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { withApiHandler } from "@/server/http/handler";
import { parseBody, parseQuery } from "@/server/http/validation";
import { invalidateStats } from "@/server/services/stats";
import { createTask, listTasks } from "@/server/services/tasks";
import { taskListQuerySchema } from "@/shared/schemas/list-query";
import { createTaskSchema } from "@/shared/schemas/task";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { id: string };

export const GET = withApiHandler<Params>(async (req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const query = parseQuery(req, taskListQuerySchema);
  return NextResponse.json(await listTasks(user.id, id, query));
});

export const POST = withApiHandler<Params>(async (req, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const input = await parseBody(req, createTaskSchema);
  const task = await createTask(user.id, id, input);
  invalidateStats(user.id);
  return NextResponse.json(task, { status: 201 });
});

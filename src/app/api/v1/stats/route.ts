import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { withApiHandler } from "@/server/http/handler";
import { getStats } from "@/server/services/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withApiHandler(async () => {
  const user = await requireUser();
  return NextResponse.json(await getStats(user.id));
});

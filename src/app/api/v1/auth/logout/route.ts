import { NextResponse } from "next/server";
import { destroySession } from "@/server/auth/session";
import { withApiHandler } from "@/server/http/handler";

export const runtime = "nodejs";

export const POST = withApiHandler(async () => {
  await destroySession();
  return new NextResponse(null, { status: 204 });
});

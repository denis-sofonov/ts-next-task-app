import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { toUserDto } from "@/server/dto";
import { withApiHandler } from "@/server/http/handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withApiHandler(async () => {
  const user = await requireUser();
  return NextResponse.json({ user: toUserDto(user) });
});

import { NextResponse } from "next/server";
import { withApiHandler } from "@/server/http/handler";
import { parseBody } from "@/server/http/validation";
import { verifyEmail } from "@/server/services/auth";
import { verifyEmailSchema } from "@/shared/schemas/auth";

export const runtime = "nodejs";

export const POST = withApiHandler(async (req) => {
  const { token } = await parseBody(req, verifyEmailSchema);
  await verifyEmail(token);
  return NextResponse.json({ verified: true });
});

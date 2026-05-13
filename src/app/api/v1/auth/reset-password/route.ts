import { NextResponse } from "next/server";
import { withApiHandler } from "@/server/http/handler";
import { parseBody } from "@/server/http/validation";
import { resetPassword } from "@/server/services/auth";
import { resetPasswordSchema } from "@/shared/schemas/auth";

export const runtime = "nodejs";

export const POST = withApiHandler(async (req) => {
  const input = await parseBody(req, resetPasswordSchema);
  await resetPassword(input);
  return NextResponse.json({ reset: true });
});

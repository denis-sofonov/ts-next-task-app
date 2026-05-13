import { NextResponse } from "next/server";
import { withApiHandler } from "@/server/http/handler";
import { clientIp, enforceRateLimit } from "@/server/http/rate-limit";
import { parseBody } from "@/server/http/validation";
import { forgotPassword } from "@/server/services/auth";
import { forgotPasswordSchema } from "@/shared/schemas/auth";

export const runtime = "nodejs";

export const POST = withApiHandler(async (req) => {
  enforceRateLimit({ key: `forgot:${clientIp(req)}`, limit: 5, windowMs: 60_000 });
  const input = await parseBody(req, forgotPasswordSchema);
  await forgotPassword(input);
  return NextResponse.json({ sent: true }, { status: 202 });
});

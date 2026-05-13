import { NextResponse } from "next/server";
import { withApiHandler } from "@/server/http/handler";
import { clientIp, enforceRateLimit } from "@/server/http/rate-limit";
import { parseBody } from "@/server/http/validation";
import { resendVerification } from "@/server/services/auth";
import { resendVerificationSchema } from "@/shared/schemas/auth";

export const runtime = "nodejs";

export const POST = withApiHandler(async (req) => {
  enforceRateLimit({ key: `resend:${clientIp(req)}`, limit: 5, windowMs: 60_000 });
  const { email } = await parseBody(req, resendVerificationSchema);
  await resendVerification(email);
  // Always 202 so the endpoint can't be used to discover which emails exist.
  return NextResponse.json({ sent: true }, { status: 202 });
});

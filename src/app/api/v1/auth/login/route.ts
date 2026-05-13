import { NextResponse } from "next/server";
import { createSession } from "@/server/auth/session";
import { toUserDto } from "@/server/dto";
import { withApiHandler } from "@/server/http/handler";
import { clientIp, enforceRateLimit } from "@/server/http/rate-limit";
import { parseBody } from "@/server/http/validation";
import { login } from "@/server/services/auth";
import { loginSchema } from "@/shared/schemas/auth";

export const runtime = "nodejs";

export const POST = withApiHandler(async (req) => {
  enforceRateLimit({ key: `login:${clientIp(req)}`, limit: 5, windowMs: 60_000 });
  const input = await parseBody(req, loginSchema);
  const user = await login(input);
  await createSession(user.id);
  return NextResponse.json({ user: toUserDto(user) });
});

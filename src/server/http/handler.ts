import { type NextRequest, NextResponse } from "next/server";
import { log } from "@/server/logger";
import { ApiError, errorResponse } from "./api-error";

type RouteContext<P> = { params: Promise<P> };
type Handler<P> = (req: NextRequest, ctx: RouteContext<P>) => Promise<Response> | Response;

// Wraps a route handler so every thrown `ApiError` becomes the shared JSON
// envelope and anything unexpected becomes a logged 500 — no try/catch noise in
// the handlers themselves. Each request is logged once with method/path/status.
export function withApiHandler<P = Record<string, never>>(handler: Handler<P>) {
  return async (req: NextRequest, ctx: RouteContext<P>): Promise<Response> => {
    const start = Date.now();
    const base = { method: req.method, path: req.nextUrl.pathname };
    try {
      const res = await handler(req, ctx);
      log("info", "request", { ...base, status: res.status, ms: Date.now() - start });
      return res;
    } catch (error) {
      const ms = Date.now() - start;
      if (error instanceof ApiError) {
        log("warn", "request_failed", { ...base, status: error.status, ms });
        return errorResponse(error);
      }
      log("error", "unhandled_error", { ...base, ms, error: String(error) });
      return NextResponse.json({ error: { message: "Internal server error" } }, { status: 500 });
    }
  };
}

import { type NextRequest, NextResponse } from "next/server";

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// Origin-based CSRF guard for the cookie-authenticated REST API. A cross-site
// page can send a request with the session cookie, but it cannot forge the
// Origin header, so a mismatched origin is rejected. (Server Actions are covered
// separately by Next's built-in action origin check.)
export function proxy(req: NextRequest) {
  if (MUTATING.has(req.method)) {
    const origin = req.headers.get("origin");
    if (origin) {
      try {
        if (new URL(origin).host !== req.headers.get("host")) {
          return NextResponse.json(
            { error: { message: "Cross-origin request blocked" } },
            { status: 403 },
          );
        }
      } catch {
        return NextResponse.json({ error: { message: "Invalid origin" } }, { status: 403 });
      }
    }
  }
  return NextResponse.next();
}

export const config = { matcher: "/api/v1/:path*" };

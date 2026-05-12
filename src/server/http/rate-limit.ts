import { tooManyRequests } from "./api-error";

// A small fixed-window limiter kept in process memory. It is enough to blunt
// brute-force attempts against the auth endpoints in a single-instance deploy.
// A multi-instance deployment would move this to Redis; the call sites would not
// change.
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  /** Unique key, e.g. `login:1.2.3.4`. */
  key: string;
  limit: number;
  windowMs: number;
}

export function enforceRateLimit({ key, limit, windowMs }: RateLimitOptions): void {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (bucket.count >= limit) {
    throw tooManyRequests("Too many requests, please try again later");
  }

  bucket.count += 1;
}

// Best-effort client IP from common proxy headers, falling back to a constant
// so a missing header doesn't disable limiting entirely.
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() ?? "unknown";
}

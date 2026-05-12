import type { NextRequest } from "next/server";
import { z } from "zod";
import { unprocessable } from "./api-error";

// Parse a JSON request body against a Zod schema, throwing a 422 with field-level
// errors on failure. Keeps every route's validation shape and status identical.
export async function parseBody<T extends z.ZodType>(
  req: NextRequest,
  schema: T,
): Promise<z.infer<T>> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw unprocessable("Request body must be valid JSON");
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw unprocessable("Validation failed", z.flattenError(result.error).fieldErrors);
  }
  return result.data;
}

// Same contract for query strings.
export function parseQuery<T extends z.ZodType>(req: NextRequest, schema: T): z.infer<T> {
  const raw = Object.fromEntries(req.nextUrl.searchParams);
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw unprocessable("Validation failed", z.flattenError(result.error).fieldErrors);
  }
  return result.data;
}

// For plain objects (e.g. Server Action form payloads) outside the HTTP layer.
export function parseInput<T extends z.ZodType>(schema: T, raw: unknown): z.infer<T> {
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw unprocessable("Validation failed", z.flattenError(result.error).fieldErrors);
  }
  return result.data;
}

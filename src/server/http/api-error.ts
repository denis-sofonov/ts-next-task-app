import { NextResponse } from "next/server";
import type { ApiErrorBody } from "@/shared/types/api";

// A typed error the service and route layers throw to signal an HTTP failure.
// The route handler wrapper turns it into the shared JSON envelope, so status
// codes and shapes stay consistent across every endpoint.
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: Record<string, string[] | undefined>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string[] | undefined>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export const badRequest = (m = "Bad request") => new ApiError(400, m);
export const unauthorized = (m = "Unauthorized") => new ApiError(401, m);
export const forbidden = (m = "Forbidden") => new ApiError(403, m);
export const notFound = (m = "Not found") => new ApiError(404, m);
export const conflict = (m = "Conflict") => new ApiError(409, m);
export const unprocessable = (
  m = "Validation failed",
  fieldErrors?: Record<string, string[] | undefined>,
) => new ApiError(422, m, fieldErrors);
export const tooManyRequests = (m = "Too many requests") => new ApiError(429, m);

export function errorResponse(error: ApiError): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    { error: { message: error.message, ...(error.fieldErrors && { errors: error.fieldErrors }) } },
    { status: error.status },
  );
}

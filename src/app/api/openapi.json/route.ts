import { NextResponse } from "next/server";
import { getOpenApiDocument } from "@/server/openapi";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json(getOpenApiDocument());
}

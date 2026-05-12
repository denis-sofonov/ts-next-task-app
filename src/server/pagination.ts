import type { PaginationMeta } from "@/shared/types/api";

export function buildPageMeta(page: number, limit: number, total: number): PaginationMeta {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export function pageOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

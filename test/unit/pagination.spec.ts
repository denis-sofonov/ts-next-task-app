import { describe, expect, it } from "vitest";
import { buildPageMeta, pageOffset } from "@/server/pagination";

describe("pagination", () => {
  it("computes total pages, rounding up", () => {
    expect(buildPageMeta(1, 20, 41)).toEqual({ page: 1, limit: 20, total: 41, totalPages: 3 });
  });

  it("never reports fewer than one page", () => {
    expect(buildPageMeta(1, 20, 0).totalPages).toBe(1);
  });

  it("derives the offset from page and limit", () => {
    expect(pageOffset(3, 20)).toBe(40);
  });
});

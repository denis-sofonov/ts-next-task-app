import { describe, expect, it } from "vitest";
import { projectListQuerySchema, taskListQuerySchema } from "@/shared/schemas/list-query";

describe("list-query schemas", () => {
  it("applies defaults for an empty query", () => {
    const q = projectListQuerySchema.parse({});
    expect(q).toMatchObject({ page: 1, limit: 20, sort: "createdAt", order: "desc" });
  });

  it("falls back to defaults for invalid sort / order instead of throwing", () => {
    const q = projectListQuerySchema.parse({ sort: "passwordHash", order: "sideways" });
    expect(q.sort).toBe("createdAt");
    expect(q.order).toBe("desc");
  });

  it("clamps an over-large limit", () => {
    expect(taskListQuerySchema.parse({ limit: "9999" }).limit).toBe(100);
  });

  it("keeps a valid status filter", () => {
    expect(taskListQuerySchema.parse({ status: "in_progress" }).status).toBe("in_progress");
  });
});

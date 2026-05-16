import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/server/auth/password";

describe("password hashing", () => {
  it("verifies a correct password and rejects a wrong one", async () => {
    const hash = await hashPassword("password123");
    expect(hash).not.toContain("password123");
    expect(await verifyPassword(hash, "password123")).toBe(true);
    expect(await verifyPassword(hash, "wrong")).toBe(false);
  });

  it("returns false for a malformed hash instead of throwing", async () => {
    expect(await verifyPassword("not-a-hash", "password123")).toBe(false);
  });
});

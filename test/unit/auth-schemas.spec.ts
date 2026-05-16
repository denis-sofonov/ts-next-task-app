import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "@/shared/schemas/auth";

describe("auth schemas", () => {
  it("normalises email to lowercase and trims", () => {
    const result = registerSchema.parse({
      name: "  Ada  ",
      email: "  Ada@Example.COM ",
      password: "password123",
    });
    expect(result.email).toBe("ada@example.com");
    expect(result.name).toBe("Ada");
  });

  it("rejects short passwords", () => {
    const result = registerSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email on login", () => {
    expect(loginSchema.safeParse({ email: "nope", password: "x" }).success).toBe(false);
  });
});

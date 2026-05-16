import { describe, expect, it } from "vitest";
import { notFound, unprocessable } from "@/server/http/api-error";
import { toFormState } from "@/server/http/form";

describe("toFormState", () => {
  it("maps a 422 ApiError to field errors", () => {
    const state = toFormState(unprocessable("Validation failed", { name: ["Name is required"] }));
    expect(state).toEqual({
      status: "error",
      message: "Validation failed",
      fieldErrors: { name: ["Name is required"] },
    });
  });

  it("maps a generic ApiError to a message", () => {
    expect(toFormState(notFound("Project not found"))).toMatchObject({
      status: "error",
      message: "Project not found",
    });
  });

  it("hides unexpected errors behind a generic message", () => {
    const state = toFormState(new Error("boom"));
    expect(state.status).toBe("error");
    expect(state.message).not.toContain("boom");
  });
});

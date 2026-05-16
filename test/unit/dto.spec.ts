import { describe, expect, it } from "vitest";
import type { Project, Task, User } from "@/server/db/schema";
import { toProjectDto, toTaskDto, toUserDto } from "@/server/dto";

const now = new Date("2026-01-02T03:04:05.000Z");

describe("dto mappers", () => {
  it("serialises a user without leaking the password hash", () => {
    const user = {
      id: "u1",
      email: "a@b.com",
      name: "A",
      passwordHash: "secret-hash",
      emailVerifiedAt: now,
      createdAt: now,
      updatedAt: now,
    } as User;
    const dto = toUserDto(user);
    expect(dto).not.toHaveProperty("passwordHash");
    expect(dto.emailVerifiedAt).toBe(now.toISOString());
  });

  it("converts project timestamps to ISO strings", () => {
    const project = {
      id: "p1",
      userId: "u1",
      name: "P",
      description: null,
      createdAt: now,
      updatedAt: now,
    } as Project;
    expect(toProjectDto(project).createdAt).toBe(now.toISOString());
  });

  it("passes the task status through unchanged", () => {
    const task = {
      id: "t1",
      projectId: "p1",
      title: "T",
      description: null,
      status: "done",
      createdAt: now,
      updatedAt: now,
    } as Task;
    expect(toTaskDto(task).status).toBe("done");
  });
});

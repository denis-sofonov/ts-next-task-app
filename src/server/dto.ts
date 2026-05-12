import type { ProjectDto, TaskDto, UserDto } from "@/shared/types/domain";
import type { Project, Task, User } from "./db/schema";

// The single Drizzle-row -> `*Dto` mapping point: an explicit whitelist, so an
// internal column (e.g. `passwordHash`) can never leak into a response.

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
  };
}

export function toProjectDto(project: Project): ProjectDto {
  return {
    id: project.id,
    userId: project.userId,
    name: project.name,
    description: project.description,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export function toTaskDto(task: Task): TaskDto {
  return {
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

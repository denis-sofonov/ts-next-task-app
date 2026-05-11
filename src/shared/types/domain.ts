import type { TaskStatus } from "../constants/task-status";

// Client-facing shapes: the JSON-serialised form of the database rows, where
// timestamps are ISO strings. Kept separate from the Drizzle row types (which
// use `Date`) so components depend on the transport contract, not the ORM.

export interface UserDto {
  id: string;
  email: string;
  name: string;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface ProjectDto {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDto {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StatsDto {
  projects: number;
  tasks: number;
  tasksByStatus: Record<TaskStatus, number>;
}

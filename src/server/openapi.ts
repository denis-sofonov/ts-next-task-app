import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { TASK_STATUSES } from "@/shared/constants/task-status";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@/shared/schemas/auth";
import { createProjectSchema, updateProjectSchema } from "@/shared/schemas/project";
import { createTaskSchema, updateTaskSchema } from "@/shared/schemas/task";

extendZodWithOpenApi(z);

// Response shapes described as Zod so the document stays in lock-step with the
// `*Dto` TypeScript interfaces the handlers actually return.
const UserDto = z
  .object({
    id: z.uuid(),
    email: z.email(),
    name: z.string(),
    emailVerifiedAt: z.string().nullable(),
    createdAt: z.string(),
  })
  .openapi("UserDto");

const ProjectDto = z
  .object({
    id: z.uuid(),
    userId: z.uuid(),
    name: z.string(),
    description: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("ProjectDto");

const TaskDto = z
  .object({
    id: z.uuid(),
    projectId: z.uuid(),
    title: z.string(),
    description: z.string().nullable(),
    status: z.enum(TASK_STATUSES),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("TaskDto");

const PaginationMeta = z
  .object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  })
  .openapi("PaginationMeta");

const ErrorBody = z
  .object({
    error: z.object({
      message: z.string(),
      errors: z.record(z.string(), z.array(z.string())).optional(),
    }),
  })
  .openapi("Error");

const paginated = (item: z.ZodTypeAny) => z.object({ data: z.array(item), meta: PaginationMeta });

function buildDocument() {
  const registry = new OpenAPIRegistry();
  const bearer = registry.registerComponent("securitySchemes", "sessionCookie", {
    type: "apiKey",
    in: "cookie",
    name: "session",
  });
  const auth = [{ [bearer.name]: [] }];

  const json = (schema: z.ZodTypeAny) => ({ content: { "application/json": { schema } } });
  const errorRes = (description: string) => ({ description, ...json(ErrorBody) });

  // ---- Auth ----
  registry.registerPath({
    method: "post",
    path: "/api/v1/auth/register",
    tags: ["Auth"],
    summary: "Register a new account",
    request: { body: json(registerSchema) },
    responses: {
      201: { description: "Created", ...json(z.object({ user: UserDto })) },
      409: errorRes("Email already in use"),
      422: errorRes("Validation failed"),
      429: errorRes("Rate limited"),
    },
  });
  registry.registerPath({
    method: "post",
    path: "/api/v1/auth/login",
    tags: ["Auth"],
    summary: "Authenticate and start a session",
    request: { body: json(loginSchema) },
    responses: {
      200: { description: "OK", ...json(z.object({ user: UserDto })) },
      401: errorRes("Invalid credentials"),
      422: errorRes("Validation failed"),
      429: errorRes("Rate limited"),
    },
  });
  registry.registerPath({
    method: "post",
    path: "/api/v1/auth/logout",
    tags: ["Auth"],
    summary: "End the current session",
    security: auth,
    responses: { 204: { description: "No content" } },
  });
  registry.registerPath({
    method: "get",
    path: "/api/v1/auth/me",
    tags: ["Auth"],
    summary: "Current authenticated user",
    security: auth,
    responses: {
      200: { description: "OK", ...json(z.object({ user: UserDto })) },
      401: errorRes("Not authenticated"),
    },
  });
  registry.registerPath({
    method: "post",
    path: "/api/v1/auth/verify-email",
    tags: ["Auth"],
    summary: "Confirm an email address",
    request: { body: json(verifyEmailSchema) },
    responses: { 200: { description: "OK" }, 401: errorRes("Invalid or expired token") },
  });
  registry.registerPath({
    method: "post",
    path: "/api/v1/auth/forgot-password",
    tags: ["Auth"],
    summary: "Request a password reset email",
    request: { body: json(forgotPasswordSchema) },
    responses: { 202: { description: "Accepted" } },
  });
  registry.registerPath({
    method: "post",
    path: "/api/v1/auth/reset-password",
    tags: ["Auth"],
    summary: "Reset a password with a token",
    request: { body: json(resetPasswordSchema) },
    responses: { 200: { description: "OK" }, 401: errorRes("Invalid or expired token") },
  });

  // ---- Projects ----
  const projectId = registry.registerParameter(
    "ProjectId",
    z.uuid().openapi({ param: { name: "id", in: "path" } }),
  );
  registry.registerPath({
    method: "get",
    path: "/api/v1/projects",
    tags: ["Projects"],
    summary: "List the caller's projects",
    security: auth,
    request: {
      query: z.object({
        page: z.coerce.number().int().optional(),
        limit: z.coerce.number().int().optional(),
        search: z.string().optional(),
        sort: z.enum(["createdAt", "updatedAt", "name"]).optional(),
        order: z.enum(["asc", "desc"]).optional(),
      }),
    },
    responses: {
      200: { description: "OK", ...json(paginated(ProjectDto)) },
      401: errorRes("Not authenticated"),
    },
  });
  registry.registerPath({
    method: "post",
    path: "/api/v1/projects",
    tags: ["Projects"],
    summary: "Create a project",
    security: auth,
    request: { body: json(createProjectSchema) },
    responses: {
      201: { description: "Created", ...json(ProjectDto) },
      422: errorRes("Validation failed"),
    },
  });
  registry.registerPath({
    method: "get",
    path: "/api/v1/projects/{id}",
    tags: ["Projects"],
    summary: "Get a project",
    security: auth,
    request: { params: z.object({ id: projectId }) },
    responses: {
      200: { description: "OK", ...json(ProjectDto) },
      403: errorRes("Not the owner"),
      404: errorRes("Not found"),
    },
  });
  registry.registerPath({
    method: "patch",
    path: "/api/v1/projects/{id}",
    tags: ["Projects"],
    summary: "Update a project",
    security: auth,
    request: { params: z.object({ id: projectId }), body: json(updateProjectSchema) },
    responses: {
      200: { description: "OK", ...json(ProjectDto) },
      403: errorRes("Not the owner"),
      404: errorRes("Not found"),
      422: errorRes("Validation failed"),
    },
  });
  registry.registerPath({
    method: "delete",
    path: "/api/v1/projects/{id}",
    tags: ["Projects"],
    summary: "Delete a project",
    security: auth,
    request: { params: z.object({ id: projectId }) },
    responses: { 204: { description: "No content" }, 404: errorRes("Not found") },
  });

  // ---- Tasks ----
  registry.registerPath({
    method: "get",
    path: "/api/v1/projects/{id}/tasks",
    tags: ["Tasks"],
    summary: "List tasks in a project",
    security: auth,
    request: {
      params: z.object({ id: projectId }),
      query: z.object({
        page: z.coerce.number().int().optional(),
        limit: z.coerce.number().int().optional(),
        search: z.string().optional(),
        status: z.enum(TASK_STATUSES).optional(),
        sort: z.enum(["createdAt", "updatedAt", "title", "status"]).optional(),
        order: z.enum(["asc", "desc"]).optional(),
      }),
    },
    responses: {
      200: { description: "OK", ...json(paginated(TaskDto)) },
      404: errorRes("Project not found"),
    },
  });
  registry.registerPath({
    method: "post",
    path: "/api/v1/projects/{id}/tasks",
    tags: ["Tasks"],
    summary: "Create a task",
    security: auth,
    request: { params: z.object({ id: projectId }), body: json(createTaskSchema) },
    responses: {
      201: { description: "Created", ...json(TaskDto) },
      422: errorRes("Validation failed"),
    },
  });
  const taskId = registry.registerParameter(
    "TaskId",
    z.uuid().openapi({ param: { name: "taskId", in: "path" } }),
  );
  registry.registerPath({
    method: "patch",
    path: "/api/v1/projects/{id}/tasks/{taskId}",
    tags: ["Tasks"],
    summary: "Update a task",
    security: auth,
    request: {
      params: z.object({ id: projectId, taskId }),
      body: json(updateTaskSchema),
    },
    responses: {
      200: { description: "OK", ...json(TaskDto) },
      404: errorRes("Not found"),
      422: errorRes("Validation failed"),
    },
  });
  registry.registerPath({
    method: "delete",
    path: "/api/v1/projects/{id}/tasks/{taskId}",
    tags: ["Tasks"],
    summary: "Delete a task",
    security: auth,
    request: { params: z.object({ id: projectId, taskId }) },
    responses: { 204: { description: "No content" }, 404: errorRes("Not found") },
  });

  // ---- System ----
  registry.registerPath({
    method: "get",
    path: "/api/v1/health",
    tags: ["System"],
    summary: "Liveness and database readiness probe",
    responses: { 200: { description: "OK" }, 503: { description: "Database unreachable" } },
  });
  registry.registerPath({
    method: "get",
    path: "/api/v1/stats",
    tags: ["System"],
    summary: "Per-user counts of projects and tasks",
    security: auth,
    responses: { 200: { description: "OK" }, 401: errorRes("Not authenticated") },
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.3",
    info: {
      title: "TaskFlow API",
      version: "1.0.0",
      description: "Projects-and-tasks REST API. Authenticated via a session cookie.",
    },
    servers: [{ url: "/" }],
    tags: [{ name: "Auth" }, { name: "Projects" }, { name: "Tasks" }, { name: "System" }],
  });
}

let cached: ReturnType<typeof buildDocument> | null = null;

export function getOpenApiDocument() {
  cached ??= buildDocument();
  return cached;
}

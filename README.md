# ts-next-task-app

[![CI](https://github.com/denis-sofonov/ts-next-task-app/actions/workflows/ci.yml/badge.svg)](https://github.com/denis-sofonov/ts-next-task-app/actions/workflows/ci.yml)

A full-stack task manager built end to end on **Next.js 16** (App Router,
TypeScript). It implements the same projects-and-tasks domain as its sibling
backend [`python-fastapi-task-api`](https://github.com/denis-sofonov/python-fastapi-task-api)
and its full-stack counterpart [`ts-nuxt-task-app`](https://github.com/denis-sofonov/ts-nuxt-task-app),
so the same problem can be compared across stacks. This is the React take: the
server API **and** the UI live in one application, with end-to-end type safety
from the database schema through to the components.

## Features

- Email + password auth with server-side sessions (signed httpOnly cookies)
- Email verification and password reset via single-use, hashed tokens
- Projects and nested tasks with ownership-based authorization
- Pagination, search, status filtering and whitelisted sorting
- Per-endpoint rate limiting, Origin-based CSRF protection and a versioned `/api/v1`
- Health probe, cached per-user stats, a token-cleanup task and an
  auto-generated OpenAPI document

## Stack

| Concern        | Choice                                                  |
| -------------- | ------------------------------------------------------- |
| Framework      | Next.js 16 (App Router, RSC + Server Actions)           |
| Language       | TypeScript (strict)                                     |
| UI             | React 19, Tailwind v4, shadcn/ui (Base UI), sonner      |
| Architecture   | Feature-Sliced Design on the frontend                   |
| Database       | PostgreSQL 17                                           |
| ORM/migrations | Drizzle ORM + drizzle-kit                               |
| Validation     | Zod (schemas shared by the server and the forms)        |
| Auth           | DB-backed sessions in signed httpOnly cookies           |
| Tests          | Vitest, Playwright                                      |
| Tooling        | Biome (format + lint), ESLint (Next rules), tsc         |

## Domain

`User` → `Project` → `Task` (one-to-many at each level). Tasks carry a status
enum (`todo` / `in_progress` / `done`). Access is ownership-based: a user only
ever sees and mutates their own data; another user's resource returns `403`, a
missing one `404`.

## Architecture

One Next.js project with a clear seam between the backend domain and the React
UI, joined by a single service layer.

**One service layer, two entry points.** All business logic lives in
`src/server/services`. Both the `/api/v1` route handlers (the documented external
REST API) and the UI call into it. The UI reads through React Server Components
that invoke the services directly — no HTTP hop — and mutates through Server
Actions that call the same services and then `revalidatePath`. Authorization
(`requireOwnedProject` / `requireOwnedTask`) and validation (shared Zod schemas)
live in that layer, so neither entry point can bypass them.

**Feature-Sliced Design (frontend).** The React side is organised into FSD
layers under `src/`: `shared` (ui-kit, lib, config, the shared Zod schemas and
DTO types) → `entities` (`user`, `project`, `task`) → `features` (auth flows,
project/task CRUD, list filters) → `widgets` (header, lists) → `views` (page
compositions). Next's `app/` directory stays a thin routing layer that wires
URLs to views and route handlers. Each slice exposes a small public API via its
`index.ts`. The backend (`src/server`) sits outside FSD and is reached only
through an entity's or feature's `api` segment.

**Type safety end to end.** A single mapping layer (`src/server/dto.ts`) is the
only translation point between Drizzle rows (`Date`, every column) and the
client-facing `*Dto` types (ISO-string timestamps, an explicit field
whitelist). Mapping there means a schema change that renames or drops a field
fails to compile, and an internal column such as `passwordHash` can never leak
into a response. Zod schemas in `src/shared/schemas` are the one source for both
server validation and the in-dialog form checks.

## Design decisions & trade-offs

- **DB-backed sessions over stateless JWTs.** The cookie carries only a signed,
  opaque session id; the row is the source of truth, so logout and password
  reset revoke a session by deleting it. The cost is a lookup per request, which
  the sibling FastAPI service avoids with stateless access tokens — the usual
  trade between easy revocation and statelessness.
- **The UI calls services directly, not its own HTTP API.** Server Components
  and Server Actions invoke the service layer in-process, skipping a needless
  network round-trip and keeping full type inference. `/api/v1` still exists as
  the documented, versioned surface for external clients.
- **Argon2id for passwords, SHA-256 for tokens.** Passwords are low-entropy and
  need a slow, memory-hard KDF; verification/reset tokens are high-entropy random
  strings, so a fast hash is enough and lets us look them up by hash. Only hashes
  are stored.
- **Biome + a thin ESLint.** Biome handles formatting, linting and import
  sorting in one fast pass; ESLint is kept solely for the Next-specific
  `core-web-vitals` rules Biome doesn't provide.
- **Offset pagination, `ILIKE` search.** Pragmatic for moderate datasets; cursor
  pagination and a trigram index would be the next step at scale.
- **In-memory rate limit.** Enough for a single instance; a multi-instance
  deploy would move the limiter to Redis with no change at the call sites.

## Getting started

### Prerequisites

- Node.js 22+ (`.nvmrc`)
- pnpm 10+
- Docker

### Local development

Run the infrastructure in Docker and the app on the host:

```bash
pnpm install
cp .env.example .env            # adjust secrets as needed
docker compose up -d db mailhog # Postgres on :5439, Mailhog on :1026 / :8026
pnpm db:migrate                 # apply schema migrations
pnpm db:seed                    # optional: demo user + sample data
pnpm dev                        # http://localhost:3000
```

Demo login after seeding: `demo@taskflow.dev` / `password123`. Outgoing email
lands in the Mailhog inbox at <http://localhost:8026>.

### Run everything in Docker

```bash
docker compose --profile app up --build
```

This builds the app image, starts PostgreSQL and Mailhog, runs migrations as a
one-shot job, then serves the app at <http://localhost:3000>.

## API documentation

With the app running, the OpenAPI document is at `/api/openapi.json` and a
Scalar UI at [`/docs`](http://localhost:3000/docs). Routes are grouped by tag
(Auth, Projects, Tasks, System) under `/api/v1`.

## Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `pnpm dev`         | Start the dev server                     |
| `pnpm build`       | Production build                         |
| `pnpm check`       | Biome format + lint check                |
| `pnpm lint:next`   | ESLint (Next core-web-vitals)            |
| `pnpm typecheck`   | `tsc --noEmit`                           |
| `pnpm test`        | Vitest unit + component tests            |
| `pnpm test:e2e`    | Playwright end-to-end suite              |
| `pnpm db:generate` | Generate a migration from the schema     |
| `pnpm db:migrate`  | Apply migrations                         |
| `pnpm db:seed`     | Seed the demo user and sample data       |

## Testing

- **Unit (Vitest):** shared Zod schemas, the DTO mappers, pagination, password
  hashing and the action error envelope.
- **End-to-end (Playwright):** registers a user and drives the full project and
  task lifecycle against a production build wired to a dedicated test database.

```bash
pnpm test
pnpm test:e2e
```

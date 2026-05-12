import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/server/env";
import * as schema from "./schema";

// Reuse a single postgres-js client across hot reloads in development so we
// don't exhaust connections on every code change.
const globalForDb = globalThis as unknown as { client?: ReturnType<typeof postgres> };

const client = globalForDb.client ?? postgres(env.DATABASE_URL, { max: 10 });

if (process.env.NODE_ENV !== "production") {
  globalForDb.client = client;
}

// `casing: 'snake_case'` derives column names from the camelCase schema keys.
export const db = drizzle(client, { schema, casing: "snake_case" });

export type Db = typeof db;
export { schema };

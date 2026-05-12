import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config();

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./src/server/db/migrations",
  dialect: "postgresql",
  // Column names are derived from camelCase keys, so there are no hand-written
  // snake_case names to keep in sync between the schema and the database.
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://app:app@localhost:5439/app",
  },
  verbose: true,
  strict: true,
});

import { execSync } from "node:child_process";

// Apply migrations to the dedicated test database before the suite builds and
// starts the app against it.
export default function globalSetup() {
  const url = process.env.TEST_DATABASE_URL ?? "postgres://app:app@localhost:5439/app_test";
  execSync("pnpm db:migrate", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: url },
  });
}

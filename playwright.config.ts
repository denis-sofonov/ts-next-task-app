import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

// The e2e suite runs against a production build wired to a dedicated test
// database, so it never touches development data.
export default defineConfig({
  testDir: "./test/e2e",
  globalSetup: "./test/e2e/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `pnpm build && pnpm start --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      DATABASE_URL: process.env.TEST_DATABASE_URL ?? "postgres://app:app@localhost:5439/app_test",
      SESSION_SECRET: "e2e-secret-0123456789abcdef0123456789abcdef",
      APP_URL: BASE_URL,
      MAIL_TRANSPORT: "json",
    },
  },
});

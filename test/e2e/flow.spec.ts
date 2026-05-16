import { expect, test } from "@playwright/test";

const password = "password123";
const email = () => `e2e+${Date.now()}@example.com`;

test("register, manage a project and its tasks, then sign out", async ({ page }) => {
  // Register -> lands on the projects dashboard with a session.
  await page.goto("/register");
  await page.getByLabel("Name").fill("E2E User");
  await page.getByLabel("Email").fill(email());
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();

  // Create a project.
  await page.getByRole("button", { name: "New project" }).click();
  await page.getByLabel("Name").fill("Launch plan");
  await page.getByLabel("Description").fill("Everything for the launch");
  await page.getByRole("button", { name: "Create project" }).click();
  await expect(page.getByText("Launch plan")).toBeVisible();

  // Open it and add a task.
  await page.getByRole("link", { name: "Launch plan" }).click();
  await expect(page).toHaveURL(/\/projects\/[0-9a-f-]+$/);
  await page.getByRole("button", { name: "Add task" }).click();
  await page.getByLabel("Title").fill("Write the announcement");
  await page.getByRole("button", { name: "Create task" }).click();
  await expect(page.getByText("Write the announcement")).toBeVisible();

  // Filter by a status that excludes the new (todo) task.
  await page.goto(`${page.url().split("?")[0]}?status=done`);
  await expect(page.getByText("No matching tasks")).toBeVisible();

  // Sign out.
  await page.goto("/projects");
  await page.getByRole("button", { name: "E2E User" }).click();
  await page.getByRole("menuitem", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);
});

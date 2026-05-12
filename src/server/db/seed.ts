import "dotenv/config";
import { eq, sql } from "drizzle-orm";
import { hashPassword } from "@/server/auth/password";
import type { TaskStatus } from "@/shared/constants/task-status";
import { db } from "./index";
import { projects, tasks, users } from "./schema";

const DEMO_EMAIL = "demo@taskflow.dev";
const DEMO_PASSWORD = "password123";

const SAMPLE: { name: string; description: string; tasks: [string, TaskStatus][] }[] = [
  {
    name: "Website redesign",
    description: "Refresh the marketing site and design system.",
    tasks: [
      ["Audit current pages", "done"],
      ["Define color tokens", "in_progress"],
      ["Build component library", "todo"],
      ["Migrate landing page", "todo"],
    ],
  },
  {
    name: "Mobile app launch",
    description: "Ship v1 of the iOS and Android apps.",
    tasks: [
      ["Finalize onboarding flow", "in_progress"],
      ["Set up crash reporting", "todo"],
      ["Submit to app stores", "todo"],
    ],
  },
  {
    name: "Q3 planning",
    description: null as unknown as string,
    tasks: [
      ["Collect team goals", "done"],
      ["Draft roadmap", "done"],
    ],
  },
];

async function main() {
  console.log("Seeding database…");

  // Re-runnable: remove the demo user (cascades to projects and tasks) first.
  await db.delete(users).where(eq(sql`lower(${users.email})`, DEMO_EMAIL));

  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const [user] = await db
    .insert(users)
    .values({
      email: DEMO_EMAIL,
      name: "Demo User",
      passwordHash,
      emailVerifiedAt: new Date(),
    })
    .returning();

  for (const sample of SAMPLE) {
    const [project] = await db
      .insert(projects)
      .values({ userId: user!.id, name: sample.name, description: sample.description ?? null })
      .returning();

    await db.insert(tasks).values(
      sample.tasks.map(([title, status]) => ({
        projectId: project!.id,
        title,
        status,
      })),
    );
  }

  console.log(`Seeded demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  process.exit(0);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});

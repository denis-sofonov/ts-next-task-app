import { z } from "zod";

// Validate environment configuration once, at module load, so a missing or
// malformed variable fails fast with a clear message instead of surfacing as a
// confusing runtime error deep in a request.
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
  APP_URL: z.url().default("http://localhost:3000"),
  MAIL_HOST: z.string().default("localhost"),
  MAIL_PORT: z.coerce.number().int().default(1025),
  MAIL_FROM: z.string().default("TaskFlow <no-reply@taskflow.dev>"),
  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((v) => v === "1" || v === "true"),
  // "json" makes the mailer capture messages instead of sending them (tests/CI).
  MAIL_TRANSPORT: z.enum(["smtp", "json"]).default("smtp"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = z.flattenError(parsed.error).fieldErrors;
  throw new Error(`Invalid environment configuration: ${JSON.stringify(issues)}`);
}

export const env = parsed.data;

import "dotenv/config";
import { deleteExpiredTokens } from "@/server/auth/tokens";

// Run on a schedule (cron / a Vercel Cron route) to purge expired verification
// and password-reset tokens.
async function main() {
  const removed = await deleteExpiredTokens();
  console.log(`Removed ${removed} expired token(s).`);
  process.exit(0);
}

main().catch((error) => {
  console.error("Token cleanup failed:", error);
  process.exit(1);
});

import type { SearchParams } from "@/shared/lib/search-params";
import { ResetPasswordPage } from "@/views/auth/reset-password";

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : undefined;
  return <ResetPasswordPage token={token} />;
}

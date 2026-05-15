import type { SearchParams } from "@/shared/lib/search-params";
import { VerifyEmailPage } from "@/views/auth/verify-email";

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : undefined;
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <VerifyEmailPage token={token} />
    </main>
  );
}

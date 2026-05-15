import type { SearchParams } from "@/shared/lib/search-params";
import { LoginPage } from "@/views/auth/login";

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  return <LoginPage reset={sp.reset === "1"} />;
}

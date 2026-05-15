import { requireGuest } from "@/entities/user";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  await requireGuest();
  return <main className="flex min-h-screen items-center justify-center p-4">{children}</main>;
}

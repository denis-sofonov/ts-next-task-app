import { requireAuth } from "@/entities/user";
import { EmailVerificationBanner } from "@/features/auth/verify-email";
import { Header } from "@/widgets/header";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();
  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      {user.emailVerifiedAt ? null : <EmailVerificationBanner />}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}

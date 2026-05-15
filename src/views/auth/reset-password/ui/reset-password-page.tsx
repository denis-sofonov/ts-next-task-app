import Link from "next/link";
import { ResetPasswordForm } from "@/features/auth/reset-password";
import { routes } from "@/shared/config/routes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export function ResetPasswordPage({ token }: { token?: string }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Set a new password</CardTitle>
        <CardDescription>Choose a new password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <p className="text-sm text-muted-foreground">
            This reset link is invalid or incomplete.{" "}
            <Link href={routes.forgotPassword} className="text-foreground hover:underline">
              Request a new one
            </Link>
            .
          </p>
        )}
      </CardContent>
    </Card>
  );
}

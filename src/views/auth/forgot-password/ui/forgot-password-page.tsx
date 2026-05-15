import Link from "next/link";
import { ForgotPasswordForm } from "@/features/auth/forgot-password";
import { routes } from "@/shared/config/routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>We&apos;ll email you a link to set a new password.</CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        <Link href={routes.login} className="font-medium text-foreground hover:underline">
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}

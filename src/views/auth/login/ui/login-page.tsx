import Link from "next/link";
import { LoginForm } from "@/features/auth/login";
import { routes } from "@/shared/config/routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export function LoginPage({ reset }: { reset?: boolean }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Welcome back to TaskFlow.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {reset ? (
          <p className="rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
            Password updated. Sign in with your new password.
          </p>
        ) : null}
        <LoginForm />
        <div className="text-right text-sm">
          <Link href={routes.forgotPassword} className="text-muted-foreground hover:underline">
            Forgot password?
          </Link>
        </div>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        No account?{" "}
        <Link href={routes.register} className="ml-1 font-medium text-foreground hover:underline">
          Create one
        </Link>
      </CardFooter>
    </Card>
  );
}

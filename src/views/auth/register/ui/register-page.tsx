import Link from "next/link";
import { RegisterForm } from "@/features/auth/register";
import { routes } from "@/shared/config/routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export function RegisterPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Start organising your work with TaskFlow.</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={routes.login} className="ml-1 font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}

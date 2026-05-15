import { VerifyEmailStatus } from "@/features/auth/verify-email";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export function VerifyEmailPage({ token }: { token?: string }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Email verification</CardTitle>
      </CardHeader>
      <CardContent>
        <VerifyEmailStatus token={token ?? null} />
      </CardContent>
    </Card>
  );
}

"use client";

import { useActionState } from "react";
import { fieldError, idleFormState } from "@/shared/lib/form";
import { FieldError } from "@/shared/ui/field-error";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { SubmitButton } from "@/shared/ui/submit-button";
import { resetPasswordAction } from "../api/reset-password.action";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useActionState(resetPasswordAction, idleFormState);

  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="token" value={token} />
      {state.status === "error" && state.message ? (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required />
        <FieldError message={fieldError(state, "password")} />
      </div>
      <SubmitButton className="w-full">Reset password</SubmitButton>
    </form>
  );
}

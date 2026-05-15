"use client";

import { useActionState } from "react";
import { fieldError, idleFormState } from "@/shared/lib/form";
import { FieldError } from "@/shared/ui/field-error";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { SubmitButton } from "@/shared/ui/submit-button";
import { forgotPasswordAction } from "../api/forgot-password.action";

export function ForgotPasswordForm() {
  const [state, action] = useActionState(forgotPasswordAction, idleFormState);

  if (state.status === "success") {
    return (
      <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">{state.message}</p>
    );
  }

  return (
    <form action={action} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        <FieldError message={fieldError(state, "email")} />
      </div>
      <SubmitButton className="w-full">Send reset link</SubmitButton>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { fieldError, idleFormState } from "@/shared/lib/form";
import { FieldError } from "@/shared/ui/field-error";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { SubmitButton } from "@/shared/ui/submit-button";
import { registerAction } from "../api/register.action";

export function RegisterForm() {
  const [state, action] = useActionState(registerAction, idleFormState);

  return (
    <form action={action} className="space-y-4" noValidate>
      {state.status === "error" && state.message ? (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" autoComplete="name" required />
        <FieldError message={fieldError(state, "name")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        <FieldError message={fieldError(state, "email")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required />
        <FieldError message={fieldError(state, "password")} />
      </div>

      <SubmitButton className="w-full">Create account</SubmitButton>
    </form>
  );
}

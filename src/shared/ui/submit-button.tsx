"use client";

import { Loader2Icon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "./button";

// A submit button that reflects the enclosing form's pending state. Lives in
// `shared/ui` because every feature form reuses it.
export function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className={className}>
      {pending ? <Loader2Icon className="size-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}

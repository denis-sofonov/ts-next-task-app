"use client";

import { MailWarningIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { resendVerificationForCurrentUser } from "../api/verify-email.action";

export function EmailVerificationBanner() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 border-b bg-amber-500/10 px-4 py-2 text-sm text-amber-700 dark:text-amber-400">
      <span className="flex items-center gap-2">
        <MailWarningIcon className="size-4" />
        Your email isn&apos;t verified yet.
      </span>
      <Button
        variant="outline"
        size="xs"
        disabled={pending || sent}
        onClick={() =>
          startTransition(async () => {
            const result = await resendVerificationForCurrentUser();
            if (result.status === "success") {
              setSent(true);
              toast.success(result.message ?? "Verification email sent.");
            } else {
              toast.error(result.message ?? "Could not send the email.");
            }
          })
        }
      >
        {sent ? "Email sent" : "Resend verification"}
      </Button>
    </div>
  );
}

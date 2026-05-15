"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { routes } from "@/shared/config/routes";
import { DropdownMenuItem } from "@/shared/ui/dropdown-menu";

export function LogoutMenuItem() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      variant="destructive"
      onClick={() =>
        startTransition(async () => {
          await fetch("/api/v1/auth/logout", { method: "POST" });
          router.replace(routes.login);
          router.refresh();
        })
      }
    >
      <LogOutIcon className="size-4" />
      Sign out
    </DropdownMenuItem>
  );
}

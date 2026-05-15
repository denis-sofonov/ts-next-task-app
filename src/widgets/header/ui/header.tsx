import { SquareCheckBigIcon } from "lucide-react";
import Link from "next/link";
import type { UserDto } from "@/entities/user";
import { routes } from "@/shared/config/routes";
import { UserMenu } from "./user-menu";

export function Header({ user }: { user: UserDto }) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href={routes.projects} className="flex items-center gap-2 font-semibold">
          <SquareCheckBigIcon className="size-5 text-primary" />
          TaskFlow
        </Link>
        <UserMenu user={user} />
      </div>
    </header>
  );
}

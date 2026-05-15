"use client";

import { UserIcon } from "lucide-react";
import Link from "next/link";
import type { UserDto } from "@/entities/user";
import { LogoutMenuItem } from "@/features/auth/logout";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function UserMenu({ user }: { user: UserDto }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
        <UserIcon className="size-4" />
        {user.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
            {user.email}
          </DropdownMenuLabel>
          <DropdownMenuItem render={<Link href={routes.profile} />}>Profile</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <LogoutMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

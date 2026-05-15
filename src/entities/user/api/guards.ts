import { redirect } from "next/navigation";
import { routes } from "@/shared/config/routes";
import type { UserDto } from "@/shared/types/domain";
import { getCurrentUser } from "./current-user";

// View-level guards. `requireAuth` protects the app shell; `requireGuest` keeps
// signed-in users out of the auth pages.
export async function requireAuth(): Promise<UserDto> {
  const user = await getCurrentUser();
  if (!user) redirect(routes.login);
  return user;
}

export async function requireGuest(): Promise<void> {
  const user = await getCurrentUser();
  if (user) redirect(routes.projects);
}

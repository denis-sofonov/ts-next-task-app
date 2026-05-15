import { cache } from "react";
import { getSessionUser } from "@/server/auth/session";
import { toUserDto } from "@/server/dto";
import type { UserDto } from "@/shared/types/domain";

// Request-memoised current user for Server Components: `cache` dedupes the work
// when several parts of a render (layout + page) ask for the user.
export const getCurrentUser = cache(async (): Promise<UserDto | null> => {
  const user = await getSessionUser();
  return user ? toUserDto(user) : null;
});

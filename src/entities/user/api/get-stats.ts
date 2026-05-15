import { getStats } from "@/server/services/stats";

export function getUserStats(userId: string) {
  return getStats(userId);
}

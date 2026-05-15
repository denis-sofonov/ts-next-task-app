import { redirect } from "next/navigation";
import { getCurrentUser } from "@/entities/user";
import { routes } from "@/shared/config/routes";

export default async function Home() {
  const user = await getCurrentUser();
  redirect(user ? routes.projects : routes.login);
}

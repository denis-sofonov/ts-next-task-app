import Link from "next/link";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="text-sm text-muted-foreground">This page could not be found.</p>
      <Button render={<Link href={routes.projects} />}>Back to projects</Button>
    </div>
  );
}

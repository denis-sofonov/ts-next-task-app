"use client";

import { Button } from "@/shared/ui/button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">An unexpected error occurred.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}

"use client";

import { CircleCheckIcon, Loader2Icon, OctagonXIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { verifyEmailAction } from "../api/verify-email.action";

type State = "pending" | "success" | "error";

export function VerifyEmailStatus({ token }: { token: string | null }) {
  const [state, setState] = useState<State>(token ? "pending" : "error");
  const [message, setMessage] = useState(token ? "" : "This link is missing its token.");
  const ran = useRef(false);

  useEffect(() => {
    if (!token || ran.current) return;
    ran.current = true;
    verifyEmailAction(token).then((result) => {
      setState(result.status === "success" ? "success" : "error");
      setMessage(result.message ?? "");
    });
  }, [token]);

  return (
    <div className="space-y-4 text-center">
      {state === "pending" ? (
        <Loader2Icon className="mx-auto size-8 animate-spin text-muted-foreground" />
      ) : state === "success" ? (
        <CircleCheckIcon className="mx-auto size-8 text-emerald-600" />
      ) : (
        <OctagonXIcon className="mx-auto size-8 text-destructive" />
      )}
      <p className="text-sm text-muted-foreground">{message || "Verifying your email…"}</p>
      {state !== "pending" ? (
        <Button render={<Link href={routes.login} />} className="w-full">
          Continue to sign in
        </Button>
      ) : null}
    </div>
  );
}

"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { ProjectFormDialog } from "./project-form-dialog";

export function CreateProjectButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon className="size-4" />
        New project
      </Button>
      <ProjectFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

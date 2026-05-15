"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { TaskFormDialog } from "./task-form-dialog";

export function CreateTaskButton({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <PlusIcon className="size-4" />
        Add task
      </Button>
      <TaskFormDialog open={open} onOpenChange={setOpen} projectId={projectId} />
    </>
  );
}

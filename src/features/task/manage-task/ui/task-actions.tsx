"use client";

import { EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { TaskDto } from "@/shared/types/domain";
import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { deleteTaskAction } from "../api/task.actions";
import { TaskFormDialog } from "./task-form-dialog";

export function TaskActions({ task }: { task: TaskDto }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label="Task actions" />}
        >
          <EllipsisIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <PencilIcon className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2Icon className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TaskFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        projectId={task.projectId}
        task={task}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete task?"
        description={`"${task.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={async () => {
          const result = await deleteTaskAction(task.projectId, task.id);
          if (result.status === "success") toast.success("Task deleted");
          else toast.error(result.message ?? "Failed to delete task");
        }}
      />
    </>
  );
}

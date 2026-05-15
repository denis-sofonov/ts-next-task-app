"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { TASK_STATUS_LABELS, TASK_STATUSES } from "@/shared/constants/task-status";
import { fieldError, idleFormState } from "@/shared/lib/form";
import type { TaskDto } from "@/shared/types/domain";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { FieldError } from "@/shared/ui/field-error";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { SubmitButton } from "@/shared/ui/submit-button";
import { Textarea } from "@/shared/ui/textarea";
import { createTaskAction, updateTaskAction } from "../api/task.actions";

export function TaskFormDialog({
  open,
  onOpenChange,
  projectId,
  task,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  task?: TaskDto;
}) {
  const isEdit = Boolean(task);
  const [state, action] = useActionState(
    isEdit ? updateTaskAction : createTaskAction,
    idleFormState,
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(isEdit ? "Task updated" : "Task created");
      onOpenChange(false);
    }
  }, [state, isEdit, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form key={`${task?.id ?? "new"}-${open}`} action={action} className="space-y-4">
          <input type="hidden" name="projectId" value={projectId} />
          {isEdit ? <input type="hidden" name="taskId" value={task!.id} /> : null}
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit task" : "New task"}</DialogTitle>
            <DialogDescription>
              {isEdit ? "Update the task details." : "Add a task to this project."}
            </DialogDescription>
          </DialogHeader>

          {state.status === "error" && state.message ? (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input id="task-title" name="title" defaultValue={task?.title} required />
            <FieldError message={fieldError(state, "title")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              name="description"
              rows={3}
              defaultValue={task?.description ?? ""}
            />
            <FieldError message={fieldError(state, "description")} />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select name="status" defaultValue={task?.status ?? "todo"}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {TASK_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={fieldError(state, "status")} />
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <SubmitButton>{isEdit ? "Save changes" : "Create task"}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

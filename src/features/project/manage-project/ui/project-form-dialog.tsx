"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { fieldError, idleFormState } from "@/shared/lib/form";
import type { ProjectDto } from "@/shared/types/domain";
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
import { SubmitButton } from "@/shared/ui/submit-button";
import { Textarea } from "@/shared/ui/textarea";
import { createProjectAction, updateProjectAction } from "../api/project.actions";

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: ProjectDto;
}) {
  const isEdit = Boolean(project);
  const [state, action] = useActionState(
    isEdit ? updateProjectAction : createProjectAction,
    idleFormState,
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(isEdit ? "Project updated" : "Project created");
      onOpenChange(false);
    }
  }, [state, isEdit, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form key={`${project?.id ?? "new"}-${open}`} action={action} className="space-y-4">
          {isEdit ? <input type="hidden" name="id" value={project!.id} /> : null}
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit project" : "New project"}</DialogTitle>
            <DialogDescription>
              {isEdit ? "Update the project details." : "Create a project to organise tasks."}
            </DialogDescription>
          </DialogHeader>

          {state.status === "error" && state.message ? (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.message}
            </p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="project-name">Name</Label>
            <Input id="project-name" name="name" defaultValue={project?.name} required />
            <FieldError message={fieldError(state, "name")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              name="description"
              rows={3}
              defaultValue={project?.description ?? ""}
            />
            <FieldError message={fieldError(state, "description")} />
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <SubmitButton>{isEdit ? "Save changes" : "Create project"}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

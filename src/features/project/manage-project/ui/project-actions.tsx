"use client";

import { EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { routes } from "@/shared/config/routes";
import type { ProjectDto } from "@/shared/types/domain";
import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { deleteProjectAction } from "../api/project.actions";
import { ProjectFormDialog } from "./project-form-dialog";

export function ProjectActions({ project }: { project: ProjectDto }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" aria-label="Project actions" />}
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

      <ProjectFormDialog open={editOpen} onOpenChange={setEditOpen} project={project} />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete project?"
        description={`"${project.name}" and all of its tasks will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={async () => {
          const result = await deleteProjectAction(project.id);
          if (result.status !== "success") {
            toast.error(result.message ?? "Failed to delete project");
            return;
          }
          toast.success("Project deleted");
          // Leave the now-deleted project's detail page; on the list the
          // revalidate already removes the card.
          if (pathname === routes.project(project.id)) router.push(routes.projects);
        }}
      />
    </>
  );
}

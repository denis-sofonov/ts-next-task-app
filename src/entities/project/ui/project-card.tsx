import Link from "next/link";
import type { ReactNode } from "react";
import { routes } from "@/shared/config/routes";
import type { ProjectDto } from "@/shared/types/domain";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

// Presentational entity component. Owner actions are injected through `actions`
// so the entity stays independent of the feature layer (FSD: entities must not
// import features).
export function ProjectCard({ project, actions }: { project: ProjectDto; actions?: ReactNode }) {
  return (
    <Card className="relative transition-colors hover:border-foreground/20">
      <CardHeader>
        <CardTitle className="truncate">
          <Link href={routes.project(project.id)} className="after:absolute after:inset-0">
            {project.name}
          </Link>
        </CardTitle>
        {project.description ? (
          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
        ) : (
          <CardDescription className="italic">No description</CardDescription>
        )}
        {actions ? <CardAction className="relative z-10">{actions}</CardAction> : null}
      </CardHeader>
    </Card>
  );
}

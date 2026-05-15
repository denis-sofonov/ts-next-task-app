import { getUserStats, requireAuth } from "@/entities/user";
import { TASK_STATUS_LABELS, TASK_STATUSES } from "@/shared/constants/task-status";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export async function ProfilePage() {
  const user = await requireAuth();
  const stats = await getUserStats(user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          {user.emailVerifiedAt ? (
            <Badge variant="default">Email verified</Badge>
          ) : (
            <Badge variant="outline">Email not verified</Badge>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Projects</CardDescription>
            <CardTitle className="text-3xl">{stats.projects}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Tasks</CardDescription>
            <CardTitle className="text-3xl">{stats.tasks}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tasks by status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {TASK_STATUSES.map((status) => (
            <div key={status} className="flex items-center gap-2">
              <span className="text-2xl font-semibold">{stats.tasksByStatus[status]}</span>
              <span className="text-sm text-muted-foreground">{TASK_STATUS_LABELS[status]}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

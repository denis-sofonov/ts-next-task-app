"use client";

import { TASK_STATUS_LABELS, TASK_STATUSES } from "@/shared/constants/task-status";
import { useQueryParams } from "@/shared/lib/use-query-params";
import { SearchInput } from "@/shared/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

const ALL = "all";

export function TaskFilters() {
  const { searchParams, setParams } = useQueryParams();
  const status = searchParams.get("status") ?? ALL;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <SearchInput placeholder="Search tasks…" />
      <Select
        value={status}
        onValueChange={(value) =>
          setParams({ status: typeof value === "string" && value !== ALL ? value : undefined })
        }
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All statuses</SelectItem>
          {TASK_STATUSES.map((value) => (
            <SelectItem key={value} value={value}>
              {TASK_STATUS_LABELS[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

"use client";

import { useQueryParams } from "@/shared/lib/use-query-params";
import { SearchInput } from "@/shared/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "name:asc", label: "Name A–Z" },
  { value: "updatedAt:desc", label: "Recently updated" },
];

export function ProjectFilters() {
  const { searchParams, setParams } = useQueryParams();
  const sort = searchParams.get("sort") ?? "createdAt";
  const order = searchParams.get("order") ?? "desc";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <SearchInput placeholder="Search projects…" />
      <Select
        value={`${sort}:${order}`}
        onValueChange={(value) => {
          if (typeof value !== "string") return;
          const [nextSort, nextOrder] = value.split(":");
          setParams({ sort: nextSort, order: nextOrder });
        }}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

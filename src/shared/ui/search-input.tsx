"use client";

import { SearchIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useQueryParams } from "@/shared/lib/use-query-params";
import { Input } from "./input";

export function SearchInput({ placeholder = "Search…" }: { placeholder?: string }) {
  const { searchParams, setParams } = useQueryParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onChange(next: string) {
    setValue(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setParams({ search: next || undefined }), 300);
  }

  return (
    <div className="relative w-full sm:max-w-xs">
      <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-8"
      />
    </div>
  );
}

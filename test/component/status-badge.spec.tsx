import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "@/entities/task/ui/status-badge";

describe("StatusBadge", () => {
  it("renders the human label for each status", () => {
    expect(renderToStaticMarkup(<StatusBadge status="todo" />)).toContain("To do");
    expect(renderToStaticMarkup(<StatusBadge status="in_progress" />)).toContain("In progress");
    expect(renderToStaticMarkup(<StatusBadge status="done" />)).toContain("Done");
  });
});

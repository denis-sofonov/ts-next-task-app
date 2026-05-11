import { z } from "zod";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// Query-string values arrive as strings. Coerce, then clamp into range; an
// unparseable value falls back to the default rather than failing the request.
export const paginationSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .catch(DEFAULT_PAGE)
    .transform((n) => Math.max(1, n)),
  limit: z.coerce
    .number()
    .int()
    .catch(DEFAULT_LIMIT)
    .transform((n) => Math.min(Math.max(1, n), MAX_LIMIT)),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

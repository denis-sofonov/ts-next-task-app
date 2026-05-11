// The transport envelopes every endpoint shares.

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

// One error shape for every failure. `errors` carries Zod field errors on a 422.
export interface ApiErrorBody {
  error: {
    message: string;
    errors?: Record<string, string[] | undefined>;
  };
}

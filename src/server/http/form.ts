import { log } from "@/server/logger";
import type { FormState } from "@/shared/lib/form";
import { ApiError } from "./api-error";

// Translate a thrown error into the FormState a Server Action returns. Keeps the
// ApiError -> form mapping (validation field errors, friendly messages) in one
// place so every action surfaces failures the same way.
export function toFormState(error: unknown): FormState {
  if (error instanceof ApiError) {
    return { status: "error", message: error.message, fieldErrors: error.fieldErrors };
  }
  log("error", "action_error", { error: String(error) });
  return { status: "error", message: "Something went wrong. Please try again." };
}

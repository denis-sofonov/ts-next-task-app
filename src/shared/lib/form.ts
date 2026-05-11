// Result shape every Server Action returns, consumed by `useActionState` in the
// client forms. Pure (no server imports) so it can be shared by both sides.
export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export const idleFormState: FormState = { status: "idle" };

export function fieldError(state: FormState, field: string): string | undefined {
  return state.fieldErrors?.[field]?.[0];
}

export function optionalText(value: FormDataEntryValue | null): string | undefined {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length > 0 ? text : undefined;
}

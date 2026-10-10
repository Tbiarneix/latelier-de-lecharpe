import type { ZodError } from "zod";
import type { FormState } from "@/components/admin/ui";

/** Première erreur de chaque champ, indexée par le nom du champ (`a.b.c`). */
export function fieldErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    errors[key] ??= issue.message;
  }
  return errors;
}

export function invalid(error: ZodError): FormState {
  return {
    ok: false,
    message: "Le formulaire contient des erreurs. Corrigez les champs signalés.",
    errors: fieldErrors(error),
  };
}

export const success = (message: string): FormState => ({ ok: true, message });
export const failure = (message: string): FormState => ({ ok: false, message });

"use server";

import { headers } from "next/headers";
import { z } from "zod";
import type { FormState } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-session";
import { getAuth, MIN_PASSWORD_LENGTH } from "@/lib/auth";
import { invalid, success } from "@/lib/form-state";

const input = z
  .object({
    currentPassword: z.string().min(1, "Saisissez votre mot de passe actuel"),
    newPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Le nouveau mot de passe doit faire au moins ${MIN_PASSWORD_LENGTH} caractères`)
      .max(128, "128 caractères maximum"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Les deux mots de passe ne sont pas identiques",
    path: ["confirmPassword"],
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    message: "Le nouveau mot de passe doit être différent de l'actuel",
    path: ["newPassword"],
  });

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = input.safeParse({
    currentPassword: formData.get("currentPassword") ?? "",
    newPassword: formData.get("newPassword") ?? "",
    confirmPassword: formData.get("confirmPassword") ?? "",
  });
  if (!parsed.success) return invalid(parsed.error);

  try {
    const auth = await getAuth();
    const requestHeaders = await headers();
    await auth.api.changePassword({
      headers: requestHeaders,
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
      },
    });
    // Appel séparé : `revokeOtherSessions` de changePassword remplace aussi le jeton de
    // la session courante, ce qui fait échouer le rendu de la page qui suit l'action.
    await auth.api.revokeOtherSessions({ headers: requestHeaders });
  } catch (err) {
    console.error("changePassword :", err);
    return {
      ok: false,
      message: "Le mot de passe n'a pas été modifié.",
      errors: { currentPassword: "Mot de passe actuel incorrect" },
    };
  }

  return success("Mot de passe modifié. Les autres appareils connectés ont été déconnectés.");
}

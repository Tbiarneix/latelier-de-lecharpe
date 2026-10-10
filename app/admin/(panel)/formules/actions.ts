"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/db";
import type { FormState } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-session";
import { invalid, success } from "@/lib/form-state";

const formule = z.object({
  nom: z.string().trim().min(1, "Indiquez le nom de la formule").max(100, "100 caractères maximum"),
  prix: z
    .string()
    .trim()
    .transform((v) => v.replace(",", "."))
    .pipe(
      z
        .string()
        .regex(/^\d{1,5}(\.\d{1,2})?$/, "Indiquez un prix valide, par exemple 24 ou 24,50")
        .transform(Number),
    ),
  description: z.string().trim().max(500, "500 caractères maximum"),
  elements: z.string().transform((v) =>
    v
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
  ),
});

export async function saveFormule(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = formule.safeParse({
    nom: formData.get("nom") ?? "",
    prix: formData.get("prix") ?? "",
    description: formData.get("description") ?? "",
    elements: formData.get("elements") ?? "",
  });
  if (!parsed.success) return invalid(parsed.error);

  const values = {
    nom: parsed.data.nom,
    prix: parsed.data.prix,
    description: parsed.data.description || null,
    elements: parsed.data.elements,
  };

  const db = await getDb();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id) && id > 0) {
    await db.update(schema.formules).set(values).where(eq(schema.formules.id, id));
    revalidatePath("/admin/formules");
    return success(`Formule « ${values.nom} » modifiée.`);
  }

  await db.insert(schema.formules).values({ ...values, active: true });
  revalidatePath("/admin/formules");
  return success(`Formule « ${values.nom} » créée et visible sur le site.`);
}

export async function setFormuleActive(id: number, active: boolean): Promise<FormState> {
  await requireAdmin();
  const db = await getDb();
  await db.update(schema.formules).set({ active }).where(eq(schema.formules.id, id));
  revalidatePath("/admin/formules");
  return success(active ? "Formule activée : elle est visible sur le site." : "Formule désactivée : elle est masquée.");
}

export async function deleteFormule(id: number): Promise<FormState> {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.formules).where(eq(schema.formules.id, id));
  revalidatePath("/admin/formules");
  return success("Formule supprimée.");
}

"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/db";
import type { FormState } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-session";
import { invalid, success } from "@/lib/form-state";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choisissez une date");

const period = z
  .object({
    debut: isoDate,
    fin: isoDate,
    label: z.string().trim().max(80, "80 caractères maximum"),
  })
  .refine((p) => p.fin >= p.debut, {
    message: "La date de fin doit être après la date de début.",
    path: ["fin"],
  });

export async function addHoliday(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = period.safeParse({
    debut: formData.get("debut"),
    fin: formData.get("fin"),
    label: formData.get("label") ?? "",
  });
  if (!parsed.success) return invalid(parsed.error);

  const db = await getDb();
  await db.insert(schema.holidays).values({
    startDate: parsed.data.debut,
    endDate: parsed.data.fin,
    label: parsed.data.label || null,
  });

  revalidatePath("/admin/conges");
  return success("Période de congés ajoutée. Ces jours sont désormais bloqués à la réservation.");
}

export async function deleteHoliday(id: number): Promise<FormState> {
  await requireAdmin();
  const db = await getDb();
  await db.delete(schema.holidays).where(eq(schema.holidays.id, id));
  revalidatePath("/admin/conges");
  return success("Période supprimée.");
}

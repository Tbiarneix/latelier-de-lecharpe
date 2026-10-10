"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/db";
import type { FormState } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-session";
import { invalid, success } from "@/lib/form-state";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choisissez une date");

export async function addClosedDay(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = z.object({ day: isoDate }).safeParse({ day: formData.get("day") });
  if (!parsed.success) return invalid(parsed.error);

  const db = await getDb();
  await db.insert(schema.closedDays).values({ day: parsed.data.day }).onConflictDoNothing();

  revalidatePath("/admin/jours-complets");
  return success("Jour marqué comme complet. Il est barré dans le calendrier de réservation.");
}

export async function deleteClosedDay(day: string): Promise<FormState> {
  await requireAdmin();
  const parsed = isoDate.safeParse(day);
  if (!parsed.success) return { ok: false, message: "Date invalide." };

  const db = await getDb();
  await db.delete(schema.closedDays).where(eq(schema.closedDays.day, parsed.data));
  revalidatePath("/admin/jours-complets");
  return success("Le jour est de nouveau disponible à la réservation.");
}

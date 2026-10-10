"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/db";
import type { OpeningDay } from "@/db/schema";
import type { FormState } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-session";
import { DAYS } from "@/lib/days";
import { invalid, success } from "@/lib/form-state";

const time = z.union([z.literal(""), z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Heure invalide (HH:MM)")]);

const service = z
  .object({ debut: time, fin: time })
  .refine((s) => (s.debut === "") === (s.fin === ""), {
    message: "Renseignez l'heure d'ouverture et l'heure de fermeture, ou aucune des deux.",
    path: ["fin"],
  });

const day = z.object({
  closedDay: z.boolean(),
  closedLunch: z.boolean(),
  closedDiner: z.boolean(),
  midi: service,
  soir: service,
});

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function saveOpeningHours(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = z.array(day).length(7).safeParse(
    DAYS.map((_, i) => ({
      closedDay: formData.get(`${i}.closedDay`) === "on",
      closedLunch: formData.get(`${i}.closedLunch`) === "on",
      closedDiner: formData.get(`${i}.closedDiner`) === "on",
      midi: { debut: text(formData, `${i}.midi.debut`), fin: text(formData, `${i}.midi.fin`) },
      soir: { debut: text(formData, `${i}.soir.debut`), fin: text(formData, `${i}.soir.fin`) },
    })),
  );
  if (!parsed.success) return invalid(parsed.error);

  const hours: OpeningDay[] = parsed.data.map((d, i) => ({ day: DAYS[i], ...d }));

  const db = await getDb();
  const [existing] = await db.select({ id: schema.openingHours.id }).from(schema.openingHours).limit(1);
  if (existing) {
    await db
      .update(schema.openingHours)
      .set({ hours, updatedAt: new Date() })
      .where(eq(schema.openingHours.id, existing.id));
  } else {
    await db.insert(schema.openingHours).values({ hours });
  }

  revalidatePath("/admin/horaires");
  return success("Horaires enregistrés. Ils sont déjà visibles sur le site.");
}

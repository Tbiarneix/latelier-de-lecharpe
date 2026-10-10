"use server";

import { z } from "zod";
import { getDb, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { findSlotProblem, GROUP_THRESHOLD } from "@/lib/reservations/availability";
import { loadAvailability } from "@/lib/reservations/availability-server";
import { toLocale } from "@/lib/reservations/locales";
import {
  countRecent,
  countRecentByEmail,
  createReservation,
  sendRequestMails,
} from "@/lib/reservations/service";

export type ReservationPayload = {
  locale: string;
  name: string;
  email: string;
  phone: string;
  type: "table" | "group";
  /** Réservation de table : nombre de couverts. */
  covers: number | null;
  /** Réservation de groupe : formule choisie et nombre de convives. */
  formulaId: number | null;
  guests: number | null;
  date: string;
  time: string;
  notes: string;
  /** Piège à robots : doit rester vide. */
  website: string;
};

/** Codes d'erreur : le formulaire les traduit dans la langue du visiteur. */
export type ReservationResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string>; form?: "tooMany" | "server" };

const noControlChars = /^[^\u0000-\u001F\u007F]*$/;

const base = z.object({
  locale: z.string(),
  name: z.string().trim().min(1, "required").max(100, "tooLong").regex(noControlChars, "invalid"),
  email: z.string().trim().toLowerCase().min(1, "required").max(200, "tooLong").pipe(z.email("email")),
  phone: z.string().trim().min(1, "required").regex(/^[+()\d\s.-]{6,25}$/, "phone"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "required"),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "required"),
  notes: z.string().trim().max(1000, "tooLong"),
  website: z.string(),
});

const table = base.extend({
  type: z.literal("table"),
  covers: z.number({ error: "required" }).int("covers").min(1, "covers").max(200, "covers"),
});
const group = base.extend({
  type: z.literal("group"),
  formulaId: z.number({ error: "formula" }).int("formula"),
  guests: z.number({ error: "covers" }).int("covers").min(1, "covers").max(200, "covers"),
});
const payloadSchema = z.discriminatedUnion("type", [table, group]);

const SLOT_ERRORS = {
  past: ["date", "datePast"],
  tooLate: ["date", "dateTooLate"],
  full: ["date", "dateFull"],
  closed: ["date", "dateClosed"],
  time: ["time", "time"],
} as const;

export async function submitReservation(payload: ReservationPayload): Promise<ReservationResult> {
  // Honeypot : un robot remplit le champ caché. On répond « ok » sans rien enregistrer.
  if (typeof payload.website === "string" && payload.website !== "") return { ok: true };

  const parsed = payloadSchema.safeParse(payload);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0] ?? "form")] ??= issue.message;
    return { ok: false, errors };
  }
  const data = parsed.data;

  // Disponibilité revérifiée côté serveur : le navigateur n'est pas une source fiable.
  const problem = findSlotProblem(data.date, data.time, await loadAvailability());
  if (problem) {
    const [field, code] = SLOT_ERRORS[problem];
    return { ok: false, errors: { [field]: code } };
  }

  // Frein anti-spam : quelques demandes par adresse et par heure, et un plafond global.
  if ((await countRecentByEmail(data.email, 60 * 60 * 1000)) >= 3 || (await countRecent(10 * 60 * 1000)) >= 40) {
    return { ok: false, errors: {}, form: "tooMany" };
  }

  const db = await getDb();
  let covers: number;
  let formules: (typeof schema.reservations.$inferInsert)["formules"] = null;

  if (data.type === "group") {
    // Nom et prix relus en base : on ne fait pas confiance à ceux du navigateur.
    const [formule] = await db
      .select()
      .from(schema.formules)
      .where(and(eq(schema.formules.id, data.formulaId), eq(schema.formules.active, true)));
    if (!formule) return { ok: false, errors: { formula: "formula" } };
    covers = data.guests;
    formules = [{ id: formule.id, nom: formule.nom, prix: formule.prix, guests: data.guests }];
  } else {
    covers = data.covers;
    if (covers >= GROUP_THRESHOLD) {
      const [anyFormule] = await db
        .select({ id: schema.formules.id })
        .from(schema.formules)
        .where(eq(schema.formules.active, true))
        .limit(1);
      if (anyFormule) return { ok: false, errors: { covers: "coversGroup" } };
    }
  }

  // La réservation est enregistrée AVANT l'envoi des mails.
  let reservation;
  try {
    reservation = await createReservation({
      status: "pending",
      type: data.type,
      date: data.date,
      time: data.time,
      covers,
      name: data.name,
      email: data.email,
      phone: data.phone,
      notes: data.notes || null,
      formules,
      locale: toLocale(data.locale),
    });
  } catch (err) {
    console.error("Enregistrement de la réservation impossible :", err);
    return { ok: false, errors: {}, form: "server" };
  }

  // Un échec de mail est consigné dans mail_status (renvoi possible depuis l'admin), jamais fatal.
  try {
    await sendRequestMails(reservation);
  } catch (err) {
    console.error("Envoi des mails de réservation :", err);
  }

  return { ok: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { FormState } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-session";
import { failure, invalid, success } from "@/lib/form-state";
import { getDb, schema } from "@/db";
import {
  cancelReservationById,
  createReservation,
  decideReservationById,
  getReservationById,
  sendClientMail,
  sendRequestMails,
  updateReservationDetails,
} from "@/lib/reservations/service";
import type { ClientMailKind, Reservation } from "@/lib/reservations/mail-templates";

const PATH = "/admin/reservations";

/** Envoie le mail demandé et décrit le résultat pour la personne qui gère. */
async function notifyClient(r: Reservation, kind: ClientMailKind, notify: boolean): Promise<string> {
  if (!notify) return "";
  if (!r.email) return " Aucun email : le client n'a pas été prévenu.";
  const result = await sendClientMail(r, kind);
  return result.ok
    ? " Le client a été prévenu par mail."
    : " Le mail au client n'a pas pu être envoyé : prévenez-le par téléphone.";
}

/** Renvoie les mails d'une réservation dont l'envoi a échoué (ou a été perdu). */
export async function resendMails(id: number): Promise<FormState> {
  await requireAdmin();

  const reservation = await getReservationById(id);
  if (!reservation) return failure("Réservation introuvable.");

  if (reservation.status === "pending") {
    const status = await sendRequestMails(reservation);
    revalidatePath(PATH);
    return status === "sent"
      ? success("Mails renvoyés au restaurant et au client.")
      : failure("L'envoi a encore échoué. Vérifiez la configuration SMTP.");
  }

  // Réservation déjà traitée : on renvoie la réponse au client.
  const result = await sendClientMail(reservation, reservation.status);
  revalidatePath(PATH);
  return result.ok ? success("Mail renvoyé au client.") : failure("L'envoi a échoué. Vérifiez la configuration SMTP.");
}

export async function decideFromAdmin(id: number, decision: "confirmed" | "refused"): Promise<FormState> {
  await requireAdmin();
  const row = await decideReservationById(id, decision);
  if (!row) return failure("Cette demande a déjà été traitée.");
  const note = await notifyClient(row, decision, true);
  revalidatePath(PATH);
  return success(`Réservation de ${row.name} ${decision === "confirmed" ? "confirmée" : "refusée"}.${note}`);
}

export async function cancelFromAdmin(id: number, notify: boolean): Promise<FormState> {
  await requireAdmin();
  const row = await cancelReservationById(id);
  if (!row) return failure("Cette réservation ne peut plus être annulée.");
  const note = await notifyClient(row, "cancelled", notify);
  revalidatePath(PATH);
  return success(`Réservation de ${row.name} annulée.${note}`);
}

/* -------------------------------------------------------------------------- */
/*  Modifier                                                                  */
/* -------------------------------------------------------------------------- */

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choisissez une date");
const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choisissez une heure");
const covers = z.coerce.number({ error: "Indiquez le nombre de personnes" }).int("Indiquez le nombre de personnes").min(1, "Au moins 1 personne").max(200, "200 personnes maximum");

const edit = z.object({
  id: z.coerce.number().int().positive(),
  date: isoDate,
  time: hhmm,
  covers,
  notes: z.string().trim().max(1000, "1000 caractères maximum"),
});

// Les modifications faites par l'équipe ne sont volontairement pas bloquées par les horaires, congés
// ou jours complets : le restaurant peut accepter une exception.
export async function editReservation(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = edit.safeParse({
    id: formData.get("id"),
    date: formData.get("date"),
    time: formData.get("time"),
    covers: formData.get("covers"),
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) return invalid(parsed.error);

  const { id, notes, ...patch } = parsed.data;
  const row = await updateReservationDetails(id, { ...patch, notes: notes || null });
  if (!row) return failure("Cette réservation ne peut plus être modifiée.");

  const note = await notifyClient(row, "modified", formData.get("notify") === "on");
  revalidatePath(PATH);
  return success(`Réservation de ${row.name} modifiée.${note}`);
}

/* -------------------------------------------------------------------------- */
/*  Ajouter à la main                                                         */
/* -------------------------------------------------------------------------- */

const manual = z.object({
  name: z.string().trim().min(1, "Indiquez le nom").max(100, "100 caractères maximum"),
  phone: z.string().trim().max(25, "25 caractères maximum"),
  email: z.union([z.literal(""), z.string().trim().toLowerCase().pipe(z.email("Adresse email invalide"))]),
  date: isoDate,
  time: hhmm,
  covers,
  notes: z.string().trim().max(1000, "1000 caractères maximum"),
  locale: z.enum(["fr", "en", "es", "it"]),
});

/** Réservation prise par téléphone ou sur place : créée directement « confirmée ». */
export async function createManualReservation(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = manual.safeParse({
    name: formData.get("name") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    date: formData.get("date"),
    time: formData.get("time"),
    covers: formData.get("covers"),
    notes: formData.get("notes") ?? "",
    locale: formData.get("locale") ?? "fr",
  });
  if (!parsed.success) return invalid(parsed.error);
  const d = parsed.data;

  const created = await createReservation({
    status: "confirmed",
    type: "table",
    date: d.date,
    time: d.time,
    covers: d.covers,
    name: d.name,
    email: d.email || null,
    phone: d.phone || null,
    notes: d.notes || null,
    formules: null,
    locale: d.locale,
  });

  // Pas de mail de demande pour une réservation déjà confirmée : seulement la confirmation, si demandée.
  const db = await getDb();
  const now = new Date();
  await db
    .update(schema.reservations)
    .set({ decidedAt: now, mailStatus: "sent" })
    .where(eq(schema.reservations.id, created.id));

  const note = await notifyClient(created, "confirmed", formData.get("notify") === "on");
  revalidatePath(PATH);
  return success(`Réservation de ${created.name} ajoutée (confirmée).${note}`);
}

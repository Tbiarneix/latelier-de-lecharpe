import "server-only";
import { randomBytes } from "node:crypto";
import { and, eq, gte, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { restaurantAddress, sendMail, type MailResult } from "@/lib/mail";
import {
  renderClientMail,
  renderRestaurantMail,
  type ClientMailKind,
  type Reservation,
} from "./mail-templates";

export type NewReservation = Omit<
  typeof schema.reservations.$inferInsert,
  "id" | "token" | "createdAt" | "updatedAt" | "decidedAt" | "mailStatus"
>;

/** Jeton non devinable (192 bits) pour la page /r/[token]. */
const newToken = () => randomBytes(24).toString("base64url");

export async function createReservation(input: NewReservation): Promise<Reservation> {
  const db = await getDb();
  const [row] = await db
    .insert(schema.reservations)
    .values({ ...input, token: newToken() })
    .returning();
  return row;
}

export async function getReservationByToken(token: string): Promise<Reservation | null> {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return null;
  const db = await getDb();
  const [row] = await db.select().from(schema.reservations).where(eq(schema.reservations.token, token));
  return row ?? null;
}

export async function getReservationById(id: number): Promise<Reservation | null> {
  const db = await getDb();
  const [row] = await db.select().from(schema.reservations).where(eq(schema.reservations.id, id));
  return row ?? null;
}

/** Envoie un mail au client (s'il a une adresse). */
export async function sendClientMail(r: Reservation, kind: ClientMailKind): Promise<MailResult> {
  if (!r.email) return { ok: false, error: "Aucune adresse email pour ce client." };
  return sendMail({ to: r.email, ...renderClientMail(r, kind) });
}

async function sendRestaurantMail(r: Reservation): Promise<MailResult> {
  const to = restaurantAddress();
  if (!to) return { ok: false, error: "MAIL_TO_RESTAURANT n'est pas défini." };
  return sendMail({ to, replyTo: r.email ?? undefined, ...renderRestaurantMail(r) });
}

/**
 * Envoie les deux mails d'une demande (restaurant + accusé de réception client) et enregistre
 * le résultat dans mail_status. Un échec n'annule jamais la réservation.
 */
export async function sendRequestMails(r: Reservation): Promise<Reservation["mailStatus"]> {
  const [toRestaurant, toClient] = await Promise.all([
    sendRestaurantMail(r),
    // Une demande prise sans email (téléphone) n'a pas d'accusé à envoyer.
    r.email ? sendClientMail(r, "pending") : Promise.resolve<MailResult>({ ok: true }),
  ]);

  const status = toRestaurant.ok && toClient.ok ? "sent" : toRestaurant.ok || toClient.ok ? "partial" : "failed";

  const db = await getDb();
  await db
    .update(schema.reservations)
    .set({ mailStatus: status, updatedAt: new Date() })
    .where(eq(schema.reservations.id, r.id));
  return status;
}

export type Decision = "confirmed" | "refused";

/**
 * Passe une demande « en attente » à confirmée/refusée. La condition `status = 'pending'` est dans
 * le UPDATE : deux clics simultanés ne produisent qu'une décision. Renvoie null si déjà traitée.
 */
export async function decideReservation(token: string, decision: Decision): Promise<Reservation | null> {
  const db = await getDb();
  const now = new Date();
  const [row] = await db
    .update(schema.reservations)
    .set({ status: decision, decidedAt: now, updatedAt: now })
    .where(and(eq(schema.reservations.token, token), eq(schema.reservations.status, "pending")))
    .returning();
  return row ?? null;
}

/** Nombre de demandes récentes pour une adresse : frein simple contre le spam. */
export async function countRecentByEmail(email: string, sinceMs: number): Promise<number> {
  const db = await getDb();
  const [{ n }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(schema.reservations)
    .where(
      and(eq(schema.reservations.email, email), gte(schema.reservations.createdAt, new Date(Date.now() - sinceMs))),
    );
  return n;
}

export async function countRecent(sinceMs: number): Promise<number> {
  const db = await getDb();
  const [{ n }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(schema.reservations)
    .where(gte(schema.reservations.createdAt, new Date(Date.now() - sinceMs)));
  return n;
}

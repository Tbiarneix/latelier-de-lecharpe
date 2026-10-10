"use server";

import { z } from "zod";
import {
  decideReservation,
  getReservationByToken,
  sendClientMail,
} from "@/lib/reservations/service";

export type DecisionResult =
  | { kind: "done"; status: "confirmed" | "refused"; mail: "sent" | "failed" | "none" }
  | { kind: "already"; status: string; decidedAt: string | null }
  | { kind: "error" };

const decisionSchema = z.enum(["confirmed", "refused"]);

/**
 * Appelée par un bouton (POST), jamais par un simple lien : les scanners antivirus
 * des messageries ouvrent tous les liens d'un mail.
 */
export async function decide(token: string, decision: string): Promise<DecisionResult> {
  const parsed = decisionSchema.safeParse(decision);
  if (!parsed.success) return { kind: "error" };

  const reservation = await decideReservation(token, parsed.data);
  if (!reservation) {
    // Déjà traitée (ou jeton inconnu) : on indique l'état actuel plutôt que de refaire l'action.
    const existing = await getReservationByToken(token);
    if (!existing) return { kind: "error" };
    return { kind: "already", status: existing.status, decidedAt: existing.decidedAt?.toISOString() ?? null };
  }

  if (!reservation.email) return { kind: "done", status: parsed.data, mail: "none" };
  const mail = await sendClientMail(reservation, parsed.data);
  return { kind: "done", status: parsed.data, mail: mail.ok ? "sent" : "failed" };
}

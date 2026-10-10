"use server";

import { revalidatePath } from "next/cache";
import type { FormState } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-session";
import { failure, success } from "@/lib/form-state";
import { getReservationById, sendClientMail, sendRequestMails } from "@/lib/reservations/service";

/** Renvoie les mails d'une réservation dont l'envoi a échoué (ou a été perdu). */
export async function resendMails(id: number): Promise<FormState> {
  await requireAdmin();

  const reservation = await getReservationById(id);
  if (!reservation) return failure("Réservation introuvable.");

  if (reservation.status === "pending") {
    const status = await sendRequestMails(reservation);
    revalidatePath("/admin/reservations");
    return status === "sent"
      ? success("Mails renvoyés au restaurant et au client.")
      : failure("L'envoi a encore échoué. Vérifiez la configuration SMTP.");
  }

  // Réservation déjà traitée : on renvoie la réponse au client.
  const result = await sendClientMail(reservation, reservation.status);
  revalidatePath("/admin/reservations");
  return result.ok ? success("Mail renvoyé au client.") : failure("L'envoi a échoué. Vérifiez la configuration SMTP.");
}

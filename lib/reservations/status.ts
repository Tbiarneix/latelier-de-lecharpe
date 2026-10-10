import type { DecisionResult } from "@/app/r/[token]/actions";

export const STATUS_LABELS = {
  pending: "En attente",
  confirmed: "Confirmée",
  refused: "Refusée",
  cancelled: "Annulée",
} as const;

const PAST_PARTICIPLE: Record<string, string> = {
  confirmed: "confirmée",
  refused: "refusée",
  cancelled: "annulée",
};

/** « jeudi 24 octobre 2026 à 14:32 », heure de Paris. */
export function formatDecidedAt(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const date = d.toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris",
  });
  const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
  return `${date} à ${time}`;
}

export function describeDecision(result: Exclude<DecisionResult, { kind: "error" }>): string {
  if (result.kind === "already") {
    const when = formatDecidedAt(result.decidedAt);
    return `Déjà ${PAST_PARTICIPLE[result.status] ?? "traitée"}${when ? ` le ${when}` : ""}. Aucune action supplémentaire.`;
  }
  const state = PAST_PARTICIPLE[result.status];
  if (result.mail === "sent") return `Réservation ${state}. Le client a été prévenu par mail.`;
  if (result.mail === "failed") {
    return `Réservation ${state}, mais le mail au client n'a pas pu être envoyé : contactez-le par téléphone.`;
  }
  return `Réservation ${state}. Le client n'a pas d'email : pensez à le prévenir par téléphone.`;
}

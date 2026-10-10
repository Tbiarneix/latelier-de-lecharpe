"use client";

import { useState } from "react";
import Link from "next/link";
import { resendMails } from "@/app/admin/(panel)/reservations/actions";
import { buttonClass, Card, FormMessage, type FormState } from "@/components/admin/ui";
import { formatLongDate } from "@/lib/reservations/locales";
import { STATUS_LABELS } from "@/lib/reservations/status";

type Row = {
  id: number;
  token: string;
  status: keyof typeof STATUS_LABELS;
  type: "table" | "group";
  date: string;
  time: string;
  covers: number;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  mailStatus: "pending" | "sent" | "partial" | "failed";
};

const MAIL_LABELS = {
  pending: "Mails non envoyés",
  sent: "Mails envoyés",
  partial: "Un des mails n'est pas parti",
  failed: "Échec de l'envoi des mails",
} as const;

const STATUS_STYLE = {
  pending: "bg-amber-100 text-amber-950",
  confirmed: "bg-green-100 text-green-950",
  refused: "bg-red-100 text-red-950",
  cancelled: "bg-gray-200 text-gray-950",
} as const;

export default function ReservationsList({ reservations }: { reservations: Row[] }) {
  const [state, setState] = useState<FormState>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  if (reservations.length === 0) return <p>Aucune réservation à venir.</p>;

  return (
    <div>
      <FormMessage state={state} />
      <ul className="mt-4 flex flex-col gap-4">
        {reservations.map((r) => (
          <li key={r.id}>
            <Card>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold capitalize">
                  {formatLongDate(r.date, "fr")} à {r.time}
                </h2>
                <p className={`rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLE[r.status]}`}>
                  {STATUS_LABELS[r.status]}
                </p>
              </div>

              <p>
                <strong>{r.name}</strong> — {r.covers} personne{r.covers > 1 ? "s" : ""}
                {r.type === "group" ? " (groupe avec formule)" : ""}
              </p>
              <p>
                {r.phone && (
                  <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`} className="underline">
                    {r.phone}
                  </a>
                )}
                {r.phone && r.email && " · "}
                {r.email && <span className="break-all">{r.email}</span>}
              </p>
              {r.notes && <p className="mt-2 whitespace-pre-wrap">« {r.notes} »</p>}

              <p className={`mt-3 text-sm font-semibold ${r.mailStatus === "sent" ? "" : "text-redWine"}`}>
                {MAIL_LABELS[r.mailStatus]}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={`/r/${r.token}`} className={buttonClass.secondary}>
                  Ouvrir la demande<span className="sr-only"> de {r.name}</span>
                </Link>
                {r.mailStatus !== "sent" && (
                  <button
                    type="button"
                    disabled={busyId === r.id}
                    className={buttonClass.primary}
                    onClick={async () => {
                      setBusyId(r.id);
                      setState(await resendMails(r.id));
                      setBusyId(null);
                    }}
                  >
                    {busyId === r.id ? "Envoi…" : "Renvoyer les mails"}
                    <span className="sr-only"> pour {r.name}</span>
                  </button>
                )}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

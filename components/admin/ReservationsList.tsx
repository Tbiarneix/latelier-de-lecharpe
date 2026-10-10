"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  cancelFromAdmin,
  decideFromAdmin,
  editReservation,
  resendMails,
} from "@/app/admin/(panel)/reservations/actions";
import {
  buttonClass,
  Card,
  CheckboxField,
  Field,
  FormMessage,
  SubmitButton,
  useAdminForm,
  type FormState,
} from "@/components/admin/ui";
import { formatLongDate } from "@/lib/reservations/locales";
import { STATUS_LABELS } from "@/lib/reservations/status";

export type Row = {
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

type Panel = "edit" | "cancel" | null;

function EditPanel({ row, onDone, report }: { row: Row; onDone: () => void; report: (s: FormState) => void }) {
  const { state, pending, onSubmit, formRef } = useAdminForm(async (prev, formData) => {
    const result = await editReservation(prev, formData);
    if (result?.ok) {
      report(result);
      onDone();
    }
    return result;
  });
  const errors = state?.errors ?? {};

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-4 flex flex-col gap-4 rounded-lg border-2 border-blueDark/30 p-4">
      <h3 className="font-specialElite text-xl">Modifier la réservation de {row.name}</h3>
      <input type="hidden" name="id" value={row.id} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Date" name="date" type="date" defaultValue={row.date} error={errors.date} />
        <Field label="Heure" name="time" type="time" defaultValue={row.time} error={errors.time} />
        <Field label="Nombre de personnes" name="covers" type="number" min={1} defaultValue={row.covers} error={errors.covers} />
      </div>
      <Field label="Notes" name="notes" multiline rows={3} defaultValue={row.notes ?? ""} error={errors.notes} />
      <p className="text-sm">Ces modifications ne tiennent pas compte des horaires, congés ou jours complets.</p>
      {row.email && <CheckboxField name="notify" label="Prévenir le client par mail" defaultChecked />}
      <div className="flex flex-wrap gap-3">
        <SubmitButton pending={pending}>Enregistrer</SubmitButton>
        <button type="button" onClick={onDone} className={buttonClass.secondary}>
          Fermer sans modifier
        </button>
      </div>
      <FormMessage state={state} />
    </form>
  );
}

function CancelPanel({ row, onDone, report }: { row: Row; onDone: () => void; report: (s: FormState) => void }) {
  const [notify, setNotify] = useState(Boolean(row.email));
  const [busy, setBusy] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  useEffect(() => confirmRef.current?.focus(), []);

  return (
    <div role="group" aria-label={`Annuler la réservation de ${row.name}`} className="mt-4 flex flex-col gap-3 rounded-lg border-2 border-redWine p-4">
      <p className="font-semibold">Annuler la réservation de {row.name} ?</p>
      {row.email && (
        <div className="flex min-h-11 items-center gap-3">
          <input
            id={`notify-${row.id}`}
            type="checkbox"
            checked={notify}
            onChange={(e) => setNotify(e.target.checked)}
            className="h-6 w-6 shrink-0 accent-blueDark"
          />
          <label htmlFor={`notify-${row.id}`}>Prévenir le client par mail</label>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          ref={confirmRef}
          type="button"
          disabled={busy}
          className={buttonClass.danger}
          onClick={async () => {
            setBusy(true);
            report(await cancelFromAdmin(row.id, notify));
            setBusy(false);
            onDone();
          }}
        >
          {busy ? "Annulation…" : "Confirmer l'annulation"}
        </button>
        <button type="button" onClick={onDone} className={buttonClass.secondary}>
          Ne pas annuler
        </button>
      </div>
    </div>
  );
}

function ReservationCard({ row, today, report }: { row: Row; today: string; report: (s: FormState) => void }) {
  const [panel, setPanel] = useState<Panel>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const active = row.status === "pending" || row.status === "confirmed";

  async function run(key: string, action: () => Promise<FormState>) {
    setBusy(key);
    report(await action());
    setBusy(null);
  }

  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-semibold capitalize">
          {formatLongDate(row.date, "fr")} à {row.time}
          {row.date === today && <span className="ml-2 rounded bg-blueDark px-2 py-0.5 text-sm normal-case text-cream">Aujourd&apos;hui</span>}
        </h3>
        <p className={`rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLE[row.status]}`}>{STATUS_LABELS[row.status]}</p>
      </div>

      <p>
        <strong>{row.name}</strong> — {row.covers} personne{row.covers > 1 ? "s" : ""}
        {row.type === "group" ? " (groupe avec formule)" : ""}
      </p>
      <p>
        {row.phone && (
          <a href={`tel:${row.phone.replace(/[^\d+]/g, "")}`} className="underline">
            {row.phone}
          </a>
        )}
        {row.phone && row.email && " · "}
        {row.email && <span className="break-all">{row.email}</span>}
      </p>
      {row.notes && <p className="mt-2 whitespace-pre-wrap">« {row.notes} »</p>}

      <p className={`mt-3 text-sm font-semibold ${row.mailStatus === "sent" ? "" : "text-redWine"}`}>{MAIL_LABELS[row.mailStatus]}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {row.status === "pending" && (
          <>
            <button type="button" disabled={busy !== null} className={buttonClass.primary} onClick={() => run("ok", () => decideFromAdmin(row.id, "confirmed"))}>
              {busy === "ok" ? "…" : "Valider"}
              <span className="sr-only"> la demande de {row.name}</span>
            </button>
            <button type="button" disabled={busy !== null} className={buttonClass.secondary} onClick={() => run("no", () => decideFromAdmin(row.id, "refused"))}>
              {busy === "no" ? "…" : "Refuser"}
              <span className="sr-only"> la demande de {row.name}</span>
            </button>
          </>
        )}
        {active && (
          <>
            <button type="button" aria-expanded={panel === "edit"} className={buttonClass.secondary} onClick={() => setPanel(panel === "edit" ? null : "edit")}>
              Modifier<span className="sr-only"> la réservation de {row.name}</span>
            </button>
            <button type="button" aria-expanded={panel === "cancel"} className={buttonClass.secondary} onClick={() => setPanel(panel === "cancel" ? null : "cancel")}>
              Annuler<span className="sr-only"> la réservation de {row.name}</span>
            </button>
          </>
        )}
        {row.mailStatus !== "sent" && (
          <button type="button" disabled={busy !== null} className={buttonClass.secondary} onClick={() => run("mail", () => resendMails(row.id))}>
            {busy === "mail" ? "Envoi…" : "Renvoyer les mails"}
            <span className="sr-only"> pour {row.name}</span>
          </button>
        )}
        <Link href={`/r/${row.token}`} className={buttonClass.secondary}>
          Ouvrir la demande<span className="sr-only"> de {row.name}</span>
        </Link>
      </div>

      {panel === "edit" && <EditPanel row={row} onDone={() => setPanel(null)} report={report} />}
      {panel === "cancel" && <CancelPanel row={row} onDone={() => setPanel(null)} report={report} />}
    </Card>
  );
}

export default function ReservationsList({ reservations, today }: { reservations: Row[]; today: string }) {
  const [state, setState] = useState<FormState>(null);

  return (
    <div>
      <FormMessage state={state} />
      {reservations.length === 0 ? (
        <p className="mt-4">Aucune réservation pour cette sélection.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {reservations.map((r) => (
            <li key={r.id}>
              <ReservationCard row={r} today={today} report={setState} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

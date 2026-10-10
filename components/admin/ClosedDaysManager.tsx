"use client";

import { useState } from "react";
import { addClosedDay, deleteClosedDay } from "@/app/admin/(panel)/jours-complets/actions";
import { Card, ConfirmButton, Field, FormMessage, SubmitButton, useAdminForm, type FormState } from "@/components/admin/ui";

const fmt = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function ClosedDaysManager({ days, today }: { days: string[]; today: string }) {
  const { state, pending, onSubmit, formRef } = useAdminForm(addClosedDay, { resetOnSuccess: true });
  const [deleteState, setDeleteState] = useState<FormState>(null);

  return (
    <div className="flex flex-col gap-10">
      <Card>
        <h2 className="mb-4 font-specialElite text-2xl">Ajouter un jour complet</h2>
        <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <Field label="Date" name="day" type="date" min={today} error={state?.errors?.day} />
          <div className="flex flex-col items-start gap-3">
            <SubmitButton pending={pending}>Ajouter ce jour</SubmitButton>
            <FormMessage state={state} />
          </div>
        </form>
      </Card>

      <section aria-labelledby="liste-complets">
        <h2 id="liste-complets" className="mb-4 font-specialElite text-2xl">
          Jours à venir marqués complets
        </h2>
        <FormMessage state={deleteState} />
        {days.length === 0 ? (
          <p>Aucun jour complet à venir.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {days.map((day) => (
              <li key={day}>
                <Card className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold capitalize">{fmt(day)}</p>
                  <ConfirmButton
                    label={`Rendre le ${fmt(day)} de nouveau disponible`}
                    confirmLabel="Confirmer"
                    onConfirm={async () => setDeleteState(await deleteClosedDay(day))}
                  >
                    Retirer
                  </ConfirmButton>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

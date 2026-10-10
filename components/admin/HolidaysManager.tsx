"use client";

import { useState } from "react";
import { addHoliday, deleteHoliday } from "@/app/admin/(panel)/conges/actions";
import { Card, ConfirmButton, Field, FormMessage, SubmitButton, useAdminForm, type FormState } from "@/components/admin/ui";

type Period = { id: number; debut: string; fin: string; label: string | null };

const fmt = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default function HolidaysManager({ periods, today }: { periods: Period[]; today: string }) {
  const { state, pending, onSubmit, formRef } = useAdminForm(addHoliday, { resetOnSuccess: true });
  const [deleteState, setDeleteState] = useState<FormState>(null);
  const errors = state?.errors ?? {};

  return (
    <div className="flex flex-col gap-10">
      <Card>
        <h2 className="mb-4 font-specialElite text-2xl">Ajouter une période</h2>
        <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Premier jour de fermeture" name="debut" type="date" min={today} error={errors.debut} />
            <Field label="Dernier jour de fermeture" name="fin" type="date" min={today} error={errors.fin} />
          </div>
          <Field
            label="Libellé (facultatif)"
            name="label"
            type="text"
            maxLength={80}
            hint="Pour vous y retrouver, par exemple « Vacances d'été »."
            error={errors.label}
          />
          <div className="flex flex-col items-start gap-3">
            <SubmitButton pending={pending}>Ajouter la période</SubmitButton>
            <FormMessage state={state} />
          </div>
        </form>
      </Card>

      <section aria-labelledby="liste-conges">
        <h2 id="liste-conges" className="mb-4 font-specialElite text-2xl">
          Périodes enregistrées
        </h2>
        <FormMessage state={deleteState} />
        {periods.length === 0 ? (
          <p>Aucune période de congés enregistrée.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {periods.map((p) => (
              <li key={p.id}>
                <Card className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      Du {fmt(p.debut)} au {fmt(p.fin)}
                    </p>
                    {p.label && <p>{p.label}</p>}
                    {p.fin < today && <p className="text-sm">Période passée</p>}
                  </div>
                  <ConfirmButton
                    label={`Supprimer la période du ${fmt(p.debut)} au ${fmt(p.fin)}`}
                    onConfirm={async () => setDeleteState(await deleteHoliday(p.id))}
                  >
                    Supprimer
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

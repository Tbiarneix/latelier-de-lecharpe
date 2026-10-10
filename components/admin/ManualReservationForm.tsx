"use client";

import { useEffect, useState } from "react";
import { createManualReservation } from "@/app/admin/(panel)/reservations/actions";
import { Card, CheckboxField, Field, FormMessage, inputClass, SubmitButton, useAdminForm } from "@/components/admin/ui";

export default function ManualReservationForm({ today }: { today: string }) {
  const { state, pending, onSubmit, formRef } = useAdminForm(createManualReservation, { resetOnSuccess: true });
  const [hasEmail, setHasEmail] = useState(false);
  const errors = state?.errors ?? {};

  // Le formulaire est vidé après un ajout : les options liées à l'email disparaissent aussi.
  useEffect(() => {
    if (state?.ok) setHasEmail(false);
  }, [state]);

  return (
    <Card>
      <form ref={formRef} onSubmit={onSubmit} noValidate className="flex max-w-xl flex-col gap-4">
        <Field label="Nom" name="name" type="text" autoComplete="off" error={errors.name} />
        <Field label="Téléphone" name="phone" type="tel" autoComplete="off" error={errors.phone} />
        <Field
          label="Email (facultatif)"
          name="email"
          type="email"
          autoComplete="off"
          hint="Permet de prévenir le client par mail."
          error={errors.email}
          onChange={(e) => setHasEmail(e.target.value.trim() !== "")}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Date" name="date" type="date" defaultValue={today} error={errors.date} />
          <Field label="Heure" name="time" type="time" error={errors.time} />
          <Field label="Nombre de personnes" name="covers" type="number" min={1} error={errors.covers} />
        </div>
        <Field label="Notes" name="notes" multiline rows={3} error={errors.notes} />

        {hasEmail && (
          <>
            <div>
              <label htmlFor="locale" className="mb-1 block font-semibold">
                Langue du mail
              </label>
              <select id="locale" name="locale" defaultValue="fr" className={inputClass}>
                <option value="fr" lang="fr">Français</option>
                <option value="en" lang="en">English</option>
                <option value="es" lang="es">Español</option>
                <option value="it" lang="it">Italiano</option>
              </select>
            </div>
            <CheckboxField name="notify" label="Prévenir le client par mail (confirmation)" defaultChecked />
          </>
        )}

        <div className="flex flex-col items-start gap-3">
          <SubmitButton pending={pending}>Ajouter la réservation</SubmitButton>
          <FormMessage state={state} />
        </div>
      </form>
    </Card>
  );
}

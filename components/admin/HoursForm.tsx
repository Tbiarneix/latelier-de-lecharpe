"use client";

import type { OpeningDay } from "@/db/schema";
import { saveOpeningHours } from "@/app/admin/(panel)/horaires/actions";
import { Card, CheckboxField, Field, FormMessage, SubmitButton, useAdminForm } from "@/components/admin/ui";

export default function HoursForm({ hours, days }: { hours: OpeningDay[]; days: string[] }) {
  const { state, pending, onSubmit, formRef } = useAdminForm(saveOpeningHours);
  const errors = state?.errors ?? {};

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {days.map((day, i) => {
        const h = hours[i];
        return (
          <Card key={day}>
            <fieldset className="flex flex-col gap-4">
              <legend className="mb-2 font-specialElite text-2xl">{day}</legend>

              <CheckboxField name={`${i}.closedDay`} label="Fermé toute la journée" defaultChecked={h.closedDay} />

              <div className="grid gap-6 md:grid-cols-2">
                {(["midi", "soir"] as const).map((service) => {
                  const closedKey = service === "midi" ? "closedLunch" : "closedDiner";
                  return (
                    <fieldset key={service} className="flex flex-col gap-3">
                      <legend className="mb-1 font-semibold">Service du {service}</legend>
                      <CheckboxField
                        name={`${i}.${closedKey}`}
                        label={`Fermé le ${service}`}
                        defaultChecked={h[closedKey]}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Field
                          label="Ouverture"
                          name={`${i}.${service}.debut`}
                          type="time"
                          defaultValue={h[service].debut}
                          error={errors[`${i}.${service}.debut`]}
                        />
                        <Field
                          label="Fermeture"
                          name={`${i}.${service}.fin`}
                          type="time"
                          defaultValue={h[service].fin}
                          error={errors[`${i}.${service}.fin`]}
                        />
                      </div>
                    </fieldset>
                  );
                })}
              </div>
            </fieldset>
          </Card>
        );
      })}

      <div className="flex flex-col items-start gap-3">
        <SubmitButton pending={pending}>Enregistrer les horaires</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}

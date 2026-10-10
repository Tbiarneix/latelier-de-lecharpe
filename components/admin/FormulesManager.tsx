"use client";

import { useRef, useState } from "react";
import { deleteFormule, saveFormule, setFormuleActive } from "@/app/admin/(panel)/formules/actions";
import {
  buttonClass,
  Card,
  ConfirmButton,
  Field,
  FormMessage,
  SubmitButton,
  useAdminForm,
  type FormState,
} from "@/components/admin/ui";

type Formule = {
  id: number;
  nom: string;
  prix: number;
  description: string | null;
  elements: string[];
  active: boolean;
};

export default function FormulesManager({ formules }: { formules: Formule[] }) {
  const [editing, setEditing] = useState<Formule | null>(null);
  const [listState, setListState] = useState<FormState>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const { state, pending, onSubmit, formRef } = useAdminForm(async (prev, formData) => {
    const result = await saveFormule(prev, formData);
    if (result?.ok) setEditing(null);
    return result;
  }, { resetOnSuccess: true });
  const errors = state?.errors ?? {};

  function startEditing(f: Formule) {
    setEditing(f);
    headingRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-10">
      <Card>
        {/* key : recharge les valeurs par défaut quand on change de formule à modifier */}
        <form key={editing?.id ?? "new"} ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <h2 ref={headingRef} tabIndex={-1} className="font-specialElite text-2xl focus:outline-none">
            {editing ? `Modifier « ${editing.nom} »` : "Créer une formule"}
          </h2>
          {editing && <input type="hidden" name="id" value={editing.id} />}

          <Field label="Nom" name="nom" type="text" defaultValue={editing?.nom} maxLength={100} error={errors.nom} />
          <Field
            label="Prix par personne (€)"
            name="prix"
            type="text"
            inputMode="decimal"
            defaultValue={editing ? String(editing.prix).replace(".", ",") : ""}
            error={errors.prix}
          />
          <Field
            label="Description (facultatif)"
            name="description"
            multiline
            rows={3}
            defaultValue={editing?.description ?? ""}
            error={errors.description}
          />
          <Field
            label="Contenu de la formule"
            name="elements"
            multiline
            rows={6}
            hint="Un élément par ligne : entrée, plat, dessert…"
            defaultValue={editing?.elements.join("\n") ?? ""}
            error={errors.elements}
          />

          <div className="flex flex-wrap items-center gap-3">
            <SubmitButton pending={pending}>{editing ? "Enregistrer les modifications" : "Créer la formule"}</SubmitButton>
            {editing && (
              <button type="button" onClick={() => setEditing(null)} className={buttonClass.secondary}>
                Annuler la modification
              </button>
            )}
          </div>
          <FormMessage state={state} />
        </form>
      </Card>

      <section aria-labelledby="liste-formules">
        <h2 id="liste-formules" className="mb-4 font-specialElite text-2xl">
          Formules enregistrées
        </h2>
        <FormMessage state={listState} />
        {formules.length === 0 ? (
          <p>Aucune formule pour le moment.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {formules.map((f) => (
              <li key={f.id}>
                <Card>
                  <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xl font-semibold">
                      {f.nom} — {f.prix} €
                    </h3>
                    <p
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        f.active ? "bg-green-100 text-green-900" : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      {f.active ? "Visible sur le site" : "Masquée"}
                    </p>
                  </div>
                  {f.description && <p className="mb-2">{f.description}</p>}
                  {f.elements.length > 0 && (
                    <ul className="mb-4 list-disc pl-6">
                      {f.elements.map((el, i) => (
                        <li key={i}>{el}</li>
                      ))}
                    </ul>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(f)}
                      aria-label={`Modifier la formule ${f.nom}`}
                      className={buttonClass.secondary}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={async () => setListState(await setFormuleActive(f.id, !f.active))}
                      aria-label={`${f.active ? "Masquer" : "Afficher"} la formule ${f.nom}`}
                      className={buttonClass.secondary}
                    >
                      {f.active ? "Masquer" : "Afficher"}
                    </button>
                    <ConfirmButton
                      label={`Supprimer la formule ${f.nom}`}
                      onConfirm={async () => {
                        if (editing?.id === f.id) setEditing(null);
                        setListState(await deleteFormule(f.id));
                      }}
                    >
                      Supprimer
                    </ConfirmButton>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

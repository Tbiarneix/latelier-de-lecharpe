"use client";

import { changePassword } from "@/app/admin/(panel)/compte/actions";
import { Field, FormMessage, SubmitButton, useAdminForm } from "@/components/admin/ui";

export default function PasswordForm({ minLength }: { minLength: number }) {
  const { state, pending, onSubmit, formRef } = useAdminForm(changePassword, { resetOnSuccess: true });
  const errors = state?.errors ?? {};

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex max-w-md flex-col gap-4">
      <Field
        label="Mot de passe actuel"
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        error={errors.currentPassword}
      />
      <Field
        label="Nouveau mot de passe"
        name="newPassword"
        type="password"
        autoComplete="new-password"
        hint={`${minLength} caractères minimum. Une phrase de plusieurs mots fonctionne très bien.`}
        error={errors.newPassword}
      />
      <Field
        label="Confirmer le nouveau mot de passe"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword}
      />
      <div className="flex flex-col items-start gap-3">
        <SubmitButton pending={pending}>Changer le mot de passe</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}

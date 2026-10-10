"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type FormEvent,
  type ReactNode,
} from "react";

/* -------------------------------------------------------------------------- */
/*  État des formulaires                                                      */
/* -------------------------------------------------------------------------- */

export type FormState = {
  ok: boolean;
  message: string;
  /** Erreurs par nom de champ. */
  errors?: Record<string, string>;
} | null;

type FormAction = (prev: FormState, formData: FormData) => Promise<FormState>;

/**
 * Formulaire branché sur une Server Action. On passe par onSubmit plutôt que par
 * `action=` : React 19 réinitialise les champs après une action, ce qui effacerait
 * la saisie de la personne en cas d'erreur de validation.
 */
export function useAdminForm(action: FormAction, { resetOnSuccess = false } = {}) {
  const [state, formAction, pending] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  useEffect(() => {
    if (!state) return;
    if (state.ok && resetOnSuccess) formRef.current?.reset();
    // Erreur de validation : le focus va sur le premier champ en erreur.
    if (!state.ok) formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
  }, [state, resetOnSuccess]);

  return { state, pending, onSubmit, formRef };
}

/** Régions live : annoncées par les lecteurs d'écran, toujours présentes dans le DOM. */
export function FormMessage({ state }: { state: FormState }) {
  return (
    <>
      <div role="status" className={state?.ok ? "font-semibold text-green-900" : "sr-only"}>
        {state?.ok ? state.message : ""}
      </div>
      <div role="alert" className={state && !state.ok ? "font-semibold text-redWine" : "sr-only"}>
        {state && !state.ok ? state.message : ""}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Boutons                                                                   */
/* -------------------------------------------------------------------------- */

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueLight focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

const buttonBase = `inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`;

export const buttonClass = {
  primary: `${buttonBase} bg-blueDark text-cream hover:bg-blueLight`,
  secondary: `${buttonBase} border-2 border-blueDark text-blueDark hover:bg-blueDark/10`,
  danger: `${buttonBase} bg-redWine text-white hover:bg-red-900`,
};

export function SubmitButton({
  pending,
  children,
  pendingLabel = "Enregistrement…",
  variant = "primary",
}: {
  pending: boolean;
  children: ReactNode;
  pendingLabel?: string;
  variant?: keyof typeof buttonClass;
}) {
  return (
    <button type="submit" disabled={pending} aria-disabled={pending} className={buttonClass[variant]}>
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Action destructive en deux temps : un premier clic demande confirmation. */
export function ConfirmButton({
  children,
  confirmLabel = "Confirmer la suppression",
  onConfirm,
  disabled,
  label,
}: {
  children: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
  disabled?: boolean;
  /** Précise l'élément concerné pour les lecteurs d'écran (ex. « Supprimer la formule X »). */
  label: string;
}) {
  const [asking, setAsking] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (asking) confirmRef.current?.focus();
  }, [asking]);

  if (!asking) {
    return (
      <button
        type="button"
        onClick={() => setAsking(true)}
        disabled={disabled}
        aria-label={label}
        className={buttonClass.secondary}
      >
        {children}
      </button>
    );
  }

  return (
    <span className="inline-flex flex-wrap gap-2" role="group" aria-label={label}>
      <button
        ref={confirmRef}
        type="button"
        onClick={async () => {
          await onConfirm();
          setAsking(false);
        }}
        className={buttonClass.danger}
      >
        {confirmLabel}
      </button>
      <button type="button" onClick={() => setAsking(false)} className={buttonClass.secondary}>
        Annuler
      </button>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Champs                                                                    */
/* -------------------------------------------------------------------------- */

export const inputClass = `block w-full min-h-11 rounded-lg border-2 border-blueDark bg-white px-3 py-2 text-base text-blueDark placeholder:text-blueDark/60 aria-[invalid=true]:border-redWine ${focusRing}`;

type FieldProps = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
};

export function Field({
  label,
  name,
  error,
  hint,
  multiline,
  className,
  ...rest
}: FieldProps & { multiline?: boolean; className?: string } & Omit<
    ComponentProps<"input"> & ComponentProps<"textarea">,
    "name" | "className"
  >) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: inputClass,
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block font-semibold text-blueDark">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="mb-1 text-sm text-blueDark/80">
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea rows={4} {...common} {...(rest as ComponentProps<"textarea">)} />
      ) : (
        <input {...common} {...(rest as ComponentProps<"input">)} />
      )}
      {error && (
        <p id={errorId} className="mt-1 font-semibold text-redWine">
          {error}
        </p>
      )}
    </div>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex min-h-11 items-center gap-3">
      <input
        id={id}
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className={`h-6 w-6 shrink-0 accent-blueDark ${focusRing}`}
      />
      <label htmlFor={id} className="text-blueDark">
        {label}
      </label>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mise en page                                                              */
/* -------------------------------------------------------------------------- */

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border-2 border-blueDark/30 bg-white/70 p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

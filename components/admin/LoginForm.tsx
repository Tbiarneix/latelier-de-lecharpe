"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "block w-full min-h-11 rounded-lg border-2 border-cream bg-white px-3 py-2 text-base text-blueDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-redWine";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    const { error } = await authClient.signIn.email({
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    });

    if (error) {
      setError(
        error.status === 429
          ? "Trop de tentatives. Réessayez dans une minute."
          : "Adresse email ou mot de passe incorrect.",
      );
      setPending(false);
      emailRef.current?.focus();
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div role="alert" className={error ? "rounded-lg bg-white p-3 font-semibold text-redWine" : "sr-only"}>
        {error}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block font-semibold">
          Adresse email
        </label>
        <input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          aria-invalid={error ? true : undefined}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block font-semibold">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={error ? true : undefined}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-lg bg-mustard px-4 py-2 font-semibold text-blueDark hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-redWine disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}

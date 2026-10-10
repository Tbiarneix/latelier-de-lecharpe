"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { buttonClass } from "@/components/admin/ui";

export default function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    await authClient.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleSignOut} disabled={pending} className={buttonClass.secondary}>
      {pending ? "Déconnexion…" : "Se déconnecter"}
    </button>
  );
}

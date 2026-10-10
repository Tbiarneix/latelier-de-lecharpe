import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

/** Session courante (ou null), dédupliquée sur la durée d'une requête. */
export const getSession = cache(async () => {
  const auth = await getAuth();
  return auth.api.getSession({ headers: await headers() });
});

/**
 * À appeler dans toute page, Server Action ou route admin : la vérification
 * serveur ne repose jamais uniquement sur le proxy (qui ne teste que la présence du cookie).
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

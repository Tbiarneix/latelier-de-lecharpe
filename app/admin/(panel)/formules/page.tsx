import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import FormulesManager from "@/components/admin/FormulesManager";
import { getDb, schema } from "@/db";

export const metadata: Metadata = { title: "Formules" };
export const dynamic = "force-dynamic";

export default async function FormulesPage() {
  const db = await getDb();
  const formules = await db
    .select()
    .from(schema.formules)
    .orderBy(asc(schema.formules.prix), asc(schema.formules.id));

  return (
    <>
      <h1 className="mb-2 font-specialElite text-3xl">Formules de groupe</h1>
      <p className="mb-8">
        Les formules actives s&apos;affichent sur l&apos;accueil et dans le formulaire de réservation de groupe.
        Une formule désactivée est masquée sans être supprimée.
      </p>
      <FormulesManager formules={formules} />
    </>
  );
}

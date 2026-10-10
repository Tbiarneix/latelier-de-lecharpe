import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import MenuFilesManager from "@/components/admin/MenuFilesManager";
import { getDb, schema } from "@/db";
import { storageMode } from "@/lib/storage";

export const metadata: Metadata = { title: "Cartes" };
export const dynamic = "force-dynamic";

export default async function CartesPage() {
  const db = await getDb();
  const files = await db
    .select()
    .from(schema.menuFiles)
    .orderBy(asc(schema.menuFiles.position), asc(schema.menuFiles.id));
  const mode = storageMode();

  return (
    <>
      <h1 className="mb-2 font-specialElite text-3xl">Cartes</h1>
      <p className="mb-8">
        Ajoutez les cartes au format PDF ou image (JPEG, PNG, WebP, 15 Mo maximum par fichier). Elles s&apos;affichent
        sur la page correspondante du site, dans l&apos;ordre d&apos;ajout.
      </p>
      {mode === "none" && (
        <p role="alert" className="mb-8 rounded-lg bg-white p-4 font-semibold text-redWine">
          Le stockage des fichiers n&apos;est pas configuré (BLOB_READ_WRITE_TOKEN). L&apos;ajout est désactivé.
        </p>
      )}
      <MenuFilesManager
        mode={mode}
        files={files.map((f) => ({
          id: f.id,
          category: f.category,
          url: f.url,
          pathname: f.pathname,
          mimeType: f.mimeType,
        }))}
      />
    </>
  );
}

import type { MenuFile } from "@/lib/data";

/** Cartes d'une catégorie : images affichées en pleine largeur, PDF ouvert via un lien (et intégré sur grand écran). */
export default function MenuFiles({ files, label }: { files: MenuFile[]; label: string }) {
  if (files.length === 0) {
    return <p className="text-center font-specialElite">Aucun menu disponible pour le moment.</p>;
  }

  return (
    <>
      {files.map((file, index) => {
        const description = `Carte du ${label}${files.length > 1 ? ` (${index + 1} sur ${files.length})` : ""}`;

        if (file.mimeType === "application/pdf") {
          return (
            <div key={file.url} className="flex w-full flex-col items-center gap-4">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border-2 border-current px-5 py-3 text-center font-specialElite underline underline-offset-4 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2"
              >
                {description} — ouvrir le PDF
                <span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
              </a>
              <object
                data={file.url}
                type="application/pdf"
                aria-label={description}
                className="hidden h-[80vh] w-full md:block"
              />
            </div>
          );
        }

        return <img key={file.url} src={file.url} alt={description} className="w-full object-fill" />;
      })}
    </>
  );
}

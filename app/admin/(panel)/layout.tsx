import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-session";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Vérification serveur de la session, en plus du filtre du proxy.
  await requireAdmin();

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-blueDark"
      >
        Aller au contenu
      </a>

      <header className="bg-redWine px-4 py-5 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 font-specialElite text-xl text-cream sm:text-2xl">
            L&apos;Atelier de l&apos;Écharpe — administration
          </p>
          <AdminNav />
        </div>
      </header>

      <main id="contenu" tabIndex={-1} className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-12">
        {children}
      </main>
    </>
  );
}

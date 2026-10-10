import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

/**
 * Structure commune des pages publiques : lien d'évitement, navigation, contenu principal, pied de page.
 * Utilisée par le layout app/(site)/layout.tsx : la navigation n'est donc pas remontée (et son animation
 * pas rejouée) quand on change de page.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-blueDark focus:outline focus:outline-2 focus:outline-blueLight"
      >
        Aller au contenu
      </a>
      <Navbar />
      <main id="contenu" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}

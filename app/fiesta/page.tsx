import type { Metadata } from "next";
import CustomHeroBanner from "@/components/CustomHeroBanner";
import SiteShell from "@/components/SiteShell";
import FiestaContent from "@/components/menu/FiestaContent";
import { getMenuFiles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Fiesta et soirées",
  description:
    "Cocktails, tapas et bonne musique : les soirées de L'Atelier de l'Écharpe, bar à Toulouse près de la place Esquirol. Consultez la carte.",
  alternates: { canonical: "/fiesta" },
};

// Les cartes sont modifiables depuis l'admin : pas de rendu statique.
export const dynamic = "force-dynamic";

export default async function FiestaPage() {
  const files = await getMenuFiles("fiesta");

  return (
    <SiteShell>
      <CustomHeroBanner title="fiesta" colorText="#FBE9D5" colorBG="#C71D7A" />
      <FiestaContent files={files} />
    </SiteShell>
  );
}

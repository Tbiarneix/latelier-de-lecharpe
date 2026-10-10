import type { Metadata } from "next";
import CustomHeroBanner from "@/components/CustomHeroBanner";
import SiteShell from "@/components/SiteShell";
import DinerContent from "@/components/menu/DinerContent";
import { getMenuFiles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Carte du dîner",
  description:
    "Bistrot-brasserie au dîner à Toulouse : cuisine du marché, tapas, planches et plats mijotés. Consultez la carte de L'Atelier de l'Écharpe.",
  alternates: { canonical: "/diner" },
};

// Les cartes sont modifiables depuis l'admin : pas de rendu statique.
export const dynamic = "force-dynamic";

export default async function DinerPage() {
  const files = await getMenuFiles("diner");

  return (
    <SiteShell>
      <CustomHeroBanner title="dîner" colorText="#FBE9D5" colorBG="#A40001" />
      <DinerContent files={files} />
    </SiteShell>
  );
}

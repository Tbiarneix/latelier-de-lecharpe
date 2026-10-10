import type { Metadata } from "next";
import CustomHeroBanner from "@/components/CustomHeroBanner";
import BrunchContent from "@/components/menu/BrunchContent";
import { getMenuFiles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Carte du brunch",
  description:
    "Le brunch de L'Atelier de l'Écharpe à Toulouse : un moment gourmand et détendu. Consultez la carte.",
  alternates: { canonical: "/brunch" },
};

// Les cartes sont modifiables depuis l'admin : pas de rendu statique.
export const dynamic = "force-dynamic";

export default async function BrunchPage() {
  const files = await getMenuFiles("brunch");

  return (
    <>
      <CustomHeroBanner title="brunch" colorText="#271C82" colorBG="#FBE9D5" />
      <BrunchContent files={files} />
    </>
  );
}

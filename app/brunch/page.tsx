import CustomHeroBanner from "@/components/CustomHeroBanner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import BrunchContent from "@/components/menu/BrunchContent";
import { getMenuFiles } from "@/lib/data";

// Les cartes sont modifiables depuis l'admin : pas de rendu statique.
export const dynamic = "force-dynamic";

export default async function BrunchPage() {
  const files = await getMenuFiles("brunch");

  return (
    <>
      <Navbar />
      <CustomHeroBanner title="brunch" colorText="#271C82" colorBG="#FBE9D5" />
      <BrunchContent files={files} />
      <Footer />
    </>
  );
}

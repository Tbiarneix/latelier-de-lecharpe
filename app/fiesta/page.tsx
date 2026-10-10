import CustomHeroBanner from "@/components/CustomHeroBanner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import FiestaContent from "@/components/menu/FiestaContent";
import { getMenuFiles } from "@/lib/data";

// Les cartes sont modifiables depuis l'admin : pas de rendu statique.
export const dynamic = "force-dynamic";

export default async function FiestaPage() {
  const files = await getMenuFiles("fiesta");

  return (
    <>
      <Navbar />
      <CustomHeroBanner title="fiesta" colorText="#FBE9D5" colorBG="#C71D7A" />
      <FiestaContent files={files} />
      <Footer />
    </>
  );
}

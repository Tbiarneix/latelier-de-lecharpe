import CustomHeroBanner from "@/components/CustomHeroBanner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import FiestaContent from "@/components/menu/FiestaContent";
import { getMenuImageUrls } from "@/lib/data";

// Les cartes sont modifiables depuis l'admin : pas de rendu statique.
export const dynamic = "force-dynamic";

export default async function FiestaPage() {
  const images = await getMenuImageUrls("fiesta");

  return (
    <>
      <Navbar />
      <CustomHeroBanner title="fiesta" colorText="#FBE9D5" colorBG="#C71D7A" />
      <FiestaContent images={images} />
      <Footer />
    </>
  );
}

import CustomHeroBanner from "@/components/CustomHeroBanner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import DinerContent from "@/components/menu/DinerContent";
import { getMenuImageUrls } from "@/lib/data";

// Les cartes sont modifiables depuis l'admin : pas de rendu statique.
export const dynamic = "force-dynamic";

export default async function DinerPage() {
  const images = await getMenuImageUrls("diner");

  return (
    <>
      <Navbar />
      <CustomHeroBanner title="dîner" colorText="#FBE9D5" colorBG="#A40001" />
      <DinerContent images={images} />
      <Footer />
    </>
  );
}

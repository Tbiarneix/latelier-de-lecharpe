import ContactContent from "@/components/ContactContent";
import CustomHeroBanner from "@/components/CustomHeroBanner";
import Footer from "@/components/Footer";
import HoursList from "@/components/HoursList";
import Navbar from "@/components/Navbar";
import { getOpeningHours } from "@/lib/data";

// Les horaires sont modifiables depuis l'admin : pas de rendu statique.
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const hours = await getOpeningHours();

  return (
    <>
      <Navbar />
      <CustomHeroBanner title="contact" colorText="#C89D4C" colorBG="#FBE9D5" />
      <ContactContent
        hoursList={<HoursList hours={hours} className="flex flex-col items-center lg:items-end justify-center space-y-2" />}
      />
      <Footer />
    </>
  );
}

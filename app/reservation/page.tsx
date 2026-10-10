import ReservationForm from "@/components/reservation/ReservationForm";
import CustomHeroBanner from "@/components/CustomHeroBanner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getActiveFormules } from "@/lib/data";
import { loadAvailability } from "@/lib/reservations/availability-server";

// Horaires, congés et jours complets changent sans redéploiement : pas de rendu statique.
export const dynamic = "force-dynamic";

export default async function ReservationPage() {
  const [formules, availability] = await Promise.all([getActiveFormules(), loadAvailability()]);

  return (
    <>
      <Navbar />
      <CustomHeroBanner title="reservation" colorText="#FBE9D5" colorBG="#A40001" />
      <ReservationForm formules={formules} availability={availability} />
      <Footer />
    </>
  );
}

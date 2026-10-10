import ContactForm from "@/components/ContactFormV2";
import CustomHeroBanner from "@/components/CustomHeroBanner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  getActiveFormules,
  getClosedDays,
  getHolidayPeriods,
  getOpeningHours,
} from "@/lib/data";

// Horaires, congés et jours complets changent sans redéploiement : pas de rendu statique.
export const dynamic = "force-dynamic";

export default async function ReservationPage() {
  const [formules, openingHours, holidayPeriods, closedDays] = await Promise.all([
    getActiveFormules(),
    getOpeningHours(),
    getHolidayPeriods(),
    getClosedDays(),
  ]);

  return (
    <>
      <Navbar />
      <CustomHeroBanner title="reservation" colorText="#FBE9D5" colorBG="#A40001" />
      <ContactForm
        formules={formules}
        openingHours={openingHours}
        holidayPeriods={holidayPeriods}
        closedDays={closedDays}
      />
      <Footer />
    </>
  );
}

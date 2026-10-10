import type { Metadata } from "next";
import ReservationForm from "@/components/reservation/ReservationForm";
import CustomHeroBanner from "@/components/CustomHeroBanner";
import SiteShell from "@/components/SiteShell";
import { getActiveFormules } from "@/lib/data";
import { loadAvailability } from "@/lib/reservations/availability-server";

export const metadata: Metadata = {
  title: "Réserver une table",
  description:
    "Réservez une table ou un groupe avec formule à L'Atelier de l'Écharpe, Toulouse. Formulaire en français, anglais, espagnol et italien.",
  alternates: { canonical: "/reservation" },
};

// Horaires, congés et jours complets changent sans redéploiement : pas de rendu statique.
export const dynamic = "force-dynamic";

export default async function ReservationPage() {
  const [formules, availability] = await Promise.all([getActiveFormules(), loadAvailability()]);

  return (
    <SiteShell>
      <CustomHeroBanner title="réservation" colorText="#FBE9D5" colorBG="#A40001" />
      <ReservationForm formules={formules} availability={availability} />
    </SiteShell>
  );
}

import type { Metadata } from "next";
import ContactContent from "@/components/ContactContent";
import CustomHeroBanner from "@/components/CustomHeroBanner";
import HoursList from "@/components/HoursList";
import SiteShell from "@/components/SiteShell";
import { getOpeningHours } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact, adresse et horaires",
  description:
    "L'Atelier de l'Écharpe, 8 rue de l'Écharpe à Toulouse (près de la place Esquirol) : adresse, téléphone, horaires et modes de paiement.",
  alternates: { canonical: "/contact" },
};

// Les horaires sont modifiables depuis l'admin : pas de rendu statique.
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const hours = await getOpeningHours();

  return (
    <SiteShell>
      <CustomHeroBanner title="contact" colorText="#A40001" colorBG="#FBE9D5" />
      <ContactContent
        hoursList={<HoursList hours={hours} className="flex flex-col items-center lg:items-end justify-center space-y-2" />}
      />
    </SiteShell>
  );
}

import type { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import MainPage from "@/components/MainPage";
import SiteShell from "@/components/SiteShell";
import PopUpHappyHour from "@/components/popups/PopUpHappyHour";
import { getOpeningHours } from "@/lib/data";
import { LEGAL } from "@/lib/legal";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = { alternates: { canonical: "/" } };
export const dynamic = "force-dynamic";

const SCHEMA_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function Home() {
  const hours = await getOpeningHours();

  // Données structurées « Restaurant », horaires lus dans la base.
  const openingHoursSpecification = hours.flatMap((day, i) => {
    if (day.closedDay) return [];
    const services = [
      day.closedLunch ? null : day.midi,
      day.closedDiner ? null : day.soir,
    ].filter((s): s is { debut: string; fin: string } => Boolean(s?.debut && s?.fin));
    return services.map((s) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: SCHEMA_DAYS[i],
      opens: s.debut,
      closes: s.fin,
    }));
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: LEGAL.name,
    url: siteUrl(),
    image: `${siteUrl()}/img/info/resume-page-cream.jpg`,
    telephone: LEGAL.phone,
    email: LEGAL.email,
    servesCuisine: ["Bistrot", "Brasserie", "Tapas"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "8 rue de l'Écharpe",
      postalCode: "31000",
      addressLocality: "Toulouse",
      addressCountry: "FR",
    },
    geo: { "@type": "GeoCoordinates", latitude: 43.6020582, longitude: 1.4458477 },
    hasMenu: `${siteUrl()}/diner`,
    acceptsReservations: `${siteUrl()}/reservation`,
    sameAs: ["https://www.instagram.com/latelierdelecharpe_/"],
    ...(openingHoursSpecification.length ? { openingHoursSpecification } : {}),
  };

  return (
    <SiteShell mainClassName="flex flex-col items-center">
      <script
        type="application/ld+json"
        // Le JSON est généré côté serveur à partir de nos propres données ; « < » est échappé par sécurité.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HeroBanner />
      <PopUpHappyHour />
      <MainPage />
    </SiteShell>
  );
}

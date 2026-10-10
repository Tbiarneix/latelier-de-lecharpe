import type { Metadata } from "next";
import CustomHeroBanner from "@/components/CustomHeroBanner";
import SiteShell from "@/components/SiteShell";
import { LEGAL, LEGAL_MISSING } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site de L'Atelier de l'Écharpe, restaurant à Toulouse.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  if (LEGAL_MISSING.length > 0 && process.env.NODE_ENV === "production") {
    console.warn(`Mentions légales incomplètes (lib/legal.ts) : ${LEGAL_MISSING.join(", ")}`);
  }

  return (
    <SiteShell>
      <CustomHeroBanner title="mentions légales" colorText="#FBE9D5" colorBG="#A40001" />
      <div className="mx-auto max-w-3xl px-6 py-12 text-blueDark [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-specialElite [&_h2]:text-2xl [&_p]:mb-3 [&_a]:underline">
        <h2 className="!mt-0">Éditeur du site</h2>
        <p>
          <strong>{LEGAL.name}</strong>
          <br />
          {LEGAL.legalForm && (
            <>
              {LEGAL.legalForm}
              <br />
            </>
          )}
          {LEGAL.address}
          <br />
          Téléphone : <a href={`tel:${LEGAL.phone.replace(/\s/g, "")}`}>{LEGAL.phone}</a>
          <br />
          Email : <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
          {LEGAL.siret && (
            <>
              <br />
              SIRET : {LEGAL.siret}
            </>
          )}
          {LEGAL.vat && (
            <>
              <br />
              TVA intracommunautaire : {LEGAL.vat}
            </>
          )}
        </p>
        {LEGAL.publisher && <p>Directeur de la publication : {LEGAL.publisher}</p>}

        <h2>Conception</h2>
        <p>Site conçu par {LEGAL.designer}.</p>

        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par Vercel Inc. (États-Unis) –{" "}
          <a href="https://vercel.com" rel="noopener noreferrer">
            vercel.com
          </a>
          . Les données sont stockées chez Neon, Inc., et les mails sont acheminés par IONOS.
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes, images, logos et illustrations du site sont la propriété de {LEGAL.name} ou utilisés avec
          l&apos;autorisation de leurs auteurs. Toute reproduction sans autorisation est interdite.
        </p>

        <h2>Données personnelles</h2>
        <p>
          Le traitement de vos données est décrit dans notre <a href="/confidentialite">politique de confidentialité</a>.
        </p>
      </div>
    </SiteShell>
  );
}

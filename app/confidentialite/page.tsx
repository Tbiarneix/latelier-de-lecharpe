import type { Metadata } from "next";
import CustomHeroBanner from "@/components/CustomHeroBanner";
import SiteShell from "@/components/SiteShell";
import { LEGAL } from "@/lib/legal";
import { RETENTION_MONTHS } from "@/lib/reservations/purge";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment L'Atelier de l'Écharpe utilise et protège les données de ses clients.",
  alternates: { canonical: "/confidentialite" },
};

// Le pied de page affiche les horaires lus en base : pas de rendu statique.
export const dynamic = "force-dynamic";

export default function ConfidentialitePage() {
  return (
    <SiteShell>
      <CustomHeroBanner title="confidentialité" colorText="#FBE9D5" colorBG="#A40001" />
      <div className="mx-auto max-w-3xl px-6 py-12 text-blueDark [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-specialElite [&_h2]:text-2xl [&_p]:mb-3 [&_a]:underline [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6">
        <h2 className="!mt-0">Qui est responsable de vos données ?</h2>
        <p>
          {LEGAL.name}, {LEGAL.address}. Contact :{" "}
          <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> ou {LEGAL.phone}.
        </p>

        <h2>Quelles données collectons-nous ?</h2>
        <p>Uniquement celles que vous saisissez dans le formulaire de réservation :</p>
        <ul>
          <li>nom, adresse email et numéro de téléphone ;</li>
          <li>date, heure et nombre de personnes ; formule choisie le cas échéant ;</li>
          <li>vos demandes particulières (champ libre : évitez d&apos;y indiquer des informations sensibles).</li>
        </ul>

        <h2>Pourquoi ?</h2>
        <p>
          Pour traiter votre demande de réservation, vous répondre (confirmation, refus, modification ou annulation)
          et vous joindre en cas de besoin. Cette utilisation est nécessaire pour donner suite à votre demande.
          Vos données ne sont ni vendues ni utilisées pour de la prospection.
        </p>

        <h2>Combien de temps ?</h2>
        <p>
          Les réservations sont supprimées automatiquement {RETENTION_MONTHS} mois après leur date.
        </p>

        <h2>Qui y a accès ?</h2>
        <p>L&apos;équipe du restaurant, et nos prestataires techniques, qui agissent pour notre compte :</p>
        <ul>
          <li>Vercel Inc. : hébergement du site ;</li>
          <li>Neon, Inc. : base de données ;</li>
          <li>IONOS : messagerie, qui achemine les mails de réservation.</li>
        </ul>
        <p>
          Certains de ces prestataires sont établis aux États-Unis ; les transferts sont encadrés par les mécanismes
          prévus par le RGPD (clauses contractuelles types ou cadre de protection des données UE-États-Unis).
        </p>

        <h2>Cookies et mesure d&apos;audience</h2>
        <p>
          Le site ne dépose aucun cookie publicitaire ni de suivi. La mesure d&apos;audience et de performance
          (Vercel Analytics et Speed Insights) fonctionne sans cookie et sans suivi d&apos;un site à l&apos;autre.
          Un cookie de session est utilisé uniquement dans l&apos;espace d&apos;administration, réservé à l&apos;équipe.
        </p>

        <h2>Vos droits</h2>
        <p>
          Vous pouvez demander l&apos;accès, la rectification ou l&apos;effacement de vos données, la limitation du
          traitement ou vous y opposer, en écrivant à <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>. Si vous
          estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez saisir la CNIL
          (<a href="https://www.cnil.fr" rel="noopener noreferrer">cnil.fr</a>).
        </p>
      </div>
    </SiteShell>
  );
}

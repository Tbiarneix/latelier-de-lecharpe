import Link from "next/link";
import { Card } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

const SECTIONS = [
  { href: "/admin/cartes", title: "Cartes", text: "Ajouter ou retirer les cartes (PDF ou images) du dîner, de la fiesta et du brunch." },
  { href: "/admin/horaires", title: "Horaires", text: "Modifier les horaires d'ouverture affichés sur le site." },
  { href: "/admin/conges", title: "Congés", text: "Fermer le restaurant sur une période (vacances, travaux…)." },
  { href: "/admin/jours-complets", title: "Jours complets", text: "Indiquer les jours où il n'y a plus de place." },
  { href: "/admin/formules", title: "Formules de groupe", text: "Créer, modifier ou masquer les formules proposées aux groupes." },
  { href: "/admin/compte", title: "Mon compte", text: "Changer de mot de passe ou se déconnecter." },
];

export default async function AdminHomePage() {
  const { user } = await requireAdmin();

  return (
    <>
      <h1 className="mb-2 font-specialElite text-3xl">Bonjour</h1>
      <p className="mb-8">Vous êtes connecté avec {user.email}. Que souhaitez-vous modifier ?</p>

      <ul className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map(({ href, title, text }) => (
          <li key={href}>
            <Card className="h-full">
              <h2 className="mb-2 font-specialElite text-2xl">
                <Link
                  href={href}
                  className="underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueLight focus-visible:ring-offset-2"
                >
                  {title}
                </Link>
              </h2>
              <p>{text}</p>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const ADMIN_LINKS = [
  { href: "/admin", label: "Accueil" },
  { href: "/admin/cartes", label: "Cartes" },
  { href: "/admin/horaires", label: "Horaires" },
  { href: "/admin/conges", label: "Congés" },
  { href: "/admin/jours-complets", label: "Jours complets" },
  { href: "/admin/formules", label: "Formules" },
  { href: "/admin/compte", label: "Mon compte" },
] as const;

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Administration">
      <ul className="flex flex-wrap gap-2">
        {ADMIN_LINKS.map(({ href, label }) => {
          const current = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={current ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-lg px-4 py-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-redWine ${
                  current
                    ? "bg-cream text-redWine"
                    : "text-cream underline decoration-cream/60 underline-offset-4 hover:bg-white/15"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

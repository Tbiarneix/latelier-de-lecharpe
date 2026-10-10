import SiteShell from "@/components/SiteShell";

// Le pied de page lit les horaires en base : pas de rendu statique.
export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}

import type { Metadata } from "next";
import ClosedDaysManager from "@/components/admin/ClosedDaysManager";
import { getClosedDays } from "@/lib/data";

export const metadata: Metadata = { title: "Jours complets" };
export const dynamic = "force-dynamic";

export default async function JoursCompletsPage() {
  const days = await getClosedDays();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <h1 className="mb-2 font-specialElite text-3xl">Jours complets</h1>
      <p className="mb-8">
        Marquez ici les jours où le restaurant n&apos;a plus de place. Ils sont barrés dans le calendrier de
        réservation du site.
      </p>
      <ClosedDaysManager today={today} days={days.filter((d) => d >= today)} />
    </>
  );
}

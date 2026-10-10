import type { Metadata } from "next";
import HoursForm from "@/components/admin/HoursForm";
import { getOpeningHours } from "@/lib/data";
import { DAYS } from "@/lib/days";

export const metadata: Metadata = { title: "Horaires" };
export const dynamic = "force-dynamic";

export default async function HorairesPage() {
  const saved = await getOpeningHours();
  const hours = DAYS.map(
    (day, i) =>
      saved[i] ?? {
        day,
        closedDay: false,
        closedLunch: false,
        closedDiner: false,
        midi: { debut: "", fin: "" },
        soir: { debut: "", fin: "" },
      },
  );

  return (
    <>
      <h1 className="mb-2 font-specialElite text-3xl">Horaires d&apos;ouverture</h1>
      <p className="mb-8">
        Ces horaires s&apos;affichent en bas de chaque page du site et sur la page contact. Ils servent aussi
        au calendrier de réservation : un jour coché « Fermé toute la journée » ne peut pas être réservé.
      </p>
      <HoursForm hours={hours} days={[...DAYS]} />
    </>
  );
}

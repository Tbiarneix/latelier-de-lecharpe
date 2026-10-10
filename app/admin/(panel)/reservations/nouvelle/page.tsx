import type { Metadata } from "next";
import Link from "next/link";
import ManualReservationForm from "@/components/admin/ManualReservationForm";
import { parisNow } from "@/lib/reservations/availability";

export const metadata: Metadata = { title: "Ajouter une réservation" };
export const dynamic = "force-dynamic";

export default function NouvelleReservationPage() {
  return (
    <>
      <p className="mb-4">
        <Link href="/admin/reservations" className="underline">
          ← Retour aux réservations
        </Link>
      </p>
      <h1 className="mb-2 font-specialElite text-3xl">Ajouter une réservation</h1>
      <p className="mb-8">
        Pour une réservation prise par téléphone ou sur place. Elle est enregistrée directement comme confirmée.
        L&apos;email du client est facultatif.
      </p>
      <ManualReservationForm today={parisNow().date} />
    </>
  );
}

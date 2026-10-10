import type { Metadata } from "next";
import { asc, gte, or, eq } from "drizzle-orm";
import ReservationsList from "@/components/admin/ReservationsList";
import { getDb, schema } from "@/db";
import { parisNow } from "@/lib/reservations/availability";

export const metadata: Metadata = { title: "Réservations" };
export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  const db = await getDb();
  const today = parisNow().date;

  // Réservations à venir, plus les demandes en attente même si leur date est passée.
  const rows = await db
    .select()
    .from(schema.reservations)
    .where(or(gte(schema.reservations.date, today), eq(schema.reservations.status, "pending")))
    .orderBy(asc(schema.reservations.date), asc(schema.reservations.time));

  return (
    <>
      <h1 className="mb-2 font-specialElite text-3xl">Réservations</h1>
      <p className="mb-8">
        Les demandes reçues par le site. Chaque demande est aussi envoyée par mail au restaurant, avec un lien pour
        la valider ou la refuser.
      </p>
      <ReservationsList
        reservations={rows.map((r) => ({
          id: r.id,
          token: r.token,
          status: r.status,
          type: r.type,
          date: r.date,
          time: r.time.slice(0, 5),
          covers: r.covers,
          name: r.name,
          phone: r.phone,
          email: r.email,
          notes: r.notes,
          mailStatus: r.mailStatus,
        }))}
      />
    </>
  );
}

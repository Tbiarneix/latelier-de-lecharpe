import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import HolidaysManager from "@/components/admin/HolidaysManager";
import { getDb, schema } from "@/db";

export const metadata: Metadata = { title: "Congés" };
export const dynamic = "force-dynamic";

export default async function CongesPage() {
  const db = await getDb();
  const periods = await db.select().from(schema.holidays).orderBy(asc(schema.holidays.startDate));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <h1 className="mb-2 font-specialElite text-3xl">Congés</h1>
      <p className="mb-8">
        Pendant ces périodes, le restaurant est fermé : les jours concernés sont barrés dans le calendrier de
        réservation.
      </p>
      <HolidaysManager
        today={today}
        periods={periods.map((p) => ({ id: p.id, debut: p.startDate, fin: p.endDate, label: p.label }))}
      />
    </>
  );
}

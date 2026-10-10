import type { Metadata } from "next";
import Link from "next/link";
import { and, asc, count, desc, eq, gt, inArray, lt, type SQL } from "drizzle-orm";
import ReservationsList from "@/components/admin/ReservationsList";
import { buttonClass } from "@/components/admin/ui";
import { getDb, schema } from "@/db";
import { parisNow } from "@/lib/reservations/availability";

export const metadata: Metadata = { title: "Réservations" };
export const dynamic = "force-dynamic";

const VIEWS = [
  { key: "a-traiter", label: "À traiter" },
  { key: "aujourdhui", label: "Aujourd'hui" },
  { key: "a-venir", label: "À venir" },
  { key: "passees", label: "Passées" },
] as const;
type View = (typeof VIEWS)[number]["key"];

const STATUSES = [
  { key: "actives", label: "En attente et confirmées" },
  { key: "pending", label: "En attente" },
  { key: "confirmed", label: "Confirmées" },
  { key: "refused", label: "Refusées" },
  { key: "cancelled", label: "Annulées" },
  { key: "toutes", label: "Toutes" },
] as const;
type StatusFilter = (typeof STATUSES)[number]["key"];

type SearchParams = Promise<{ vue?: string; statut?: string }>;

export default async function ReservationsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const view: View = VIEWS.some((v) => v.key === params.vue) ? (params.vue as View) : "aujourdhui";
  const statusFilter: StatusFilter = STATUSES.some((s) => s.key === params.statut)
    ? (params.statut as StatusFilter)
    : "actives";

  const db = await getDb();
  const today = parisNow().date;
  const r = schema.reservations;

  const where: SQL[] = [];
  if (view === "a-traiter") where.push(eq(r.status, "pending"));
  if (view === "aujourdhui") where.push(eq(r.date, today));
  if (view === "a-venir") where.push(gt(r.date, today));
  if (view === "passees") where.push(lt(r.date, today));

  // La vue « À traiter » ne montre que les demandes en attente : le filtre de statut n'a pas de sens.
  if (view !== "a-traiter") {
    if (statusFilter === "actives") where.push(inArray(r.status, ["pending", "confirmed"]));
    else if (statusFilter !== "toutes") where.push(eq(r.status, statusFilter));
  }

  const rows = await db
    .select()
    .from(r)
    .where(and(...where))
    .orderBy(...(view === "passees" ? [desc(r.date), desc(r.time)] : [asc(r.date), asc(r.time)]))
    .limit(200);

  const [{ pending }] = await db.select({ pending: count() }).from(r).where(eq(r.status, "pending"));

  const href = (vue: View) => `/admin/reservations?vue=${vue}${statusFilter !== "actives" ? `&statut=${statusFilter}` : ""}`;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 font-specialElite text-3xl">Réservations</h1>
          <p>Les demandes reçues par le site et les réservations prises à la main.</p>
        </div>
        <Link href="/admin/reservations/nouvelle" className={buttonClass.primary}>
          Ajouter une réservation
        </Link>
      </div>

      <nav aria-label="Période" className="mb-4">
        <ul className="flex flex-wrap gap-2">
          {VIEWS.map((v) => (
            <li key={v.key}>
              <Link
                href={href(v.key)}
                aria-current={view === v.key ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-lg border-2 border-blueDark px-4 py-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueLight focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
                  view === v.key ? "bg-blueDark text-cream" : "text-blueDark hover:bg-blueDark/10"
                }`}
              >
                {v.label}
                {v.key === "a-traiter" && pending > 0 && (
                  <span className="ml-2 rounded-full bg-redWine px-2 text-sm text-white">
                    {pending}
                    <span className="sr-only"> en attente</span>
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {view !== "a-traiter" && (
        <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
          <input type="hidden" name="vue" value={view} />
          <div>
            <label htmlFor="statut" className="mb-1 block font-semibold">
              Statut
            </label>
            <select
              id="statut"
              name="statut"
              defaultValue={statusFilter}
              className="block min-h-11 rounded-lg border-2 border-blueDark bg-white px-3 py-2 text-blueDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueLight focus-visible:ring-offset-2"
            >
              {STATUSES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={buttonClass.secondary}>
            Filtrer
          </button>
        </form>
      )}

      <h2 className="sr-only">
        {VIEWS.find((v) => v.key === view)!.label} : {rows.length} réservation{rows.length > 1 ? "s" : ""}
      </h2>
      <p aria-live="polite" className="mb-4 font-semibold">
        {rows.length} réservation{rows.length > 1 ? "s" : ""}
      </p>

      <ReservationsList
        today={today}
        reservations={rows.map((x) => ({
          id: x.id,
          token: x.token,
          status: x.status,
          type: x.type,
          date: x.date,
          time: x.time.slice(0, 5),
          covers: x.covers,
          name: x.name,
          phone: x.phone,
          email: x.email,
          notes: x.notes,
          mailStatus: x.mailStatus,
        }))}
      />
    </>
  );
}

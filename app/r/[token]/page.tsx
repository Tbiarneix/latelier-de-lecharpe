import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatLongDate } from "@/lib/reservations/locales";
import { formatPrice } from "@/lib/reservations/mail-templates";
import { getReservationByToken } from "@/lib/reservations/service";
import { formatDecidedAt, STATUS_LABELS } from "@/lib/reservations/status";
import DecisionForm from "./DecisionForm";

// Page ouverte depuis un mail : jamais indexée, et le jeton ne doit pas fuiter par le Referer.
export const metadata: Metadata = {
  title: "Demande de réservation",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export const dynamic = "force-dynamic";

const STATUS_STYLE = {
  pending: "bg-amber-100 text-amber-950",
  confirmed: "bg-green-100 text-green-950",
  refused: "bg-red-100 text-red-950",
  cancelled: "bg-gray-200 text-gray-950",
} as const;

export default async function ReservationDecisionPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const r = await getReservationByToken(token);
  if (!r) notFound();

  const formulas = r.formules ?? [];
  const total = formulas.reduce((sum, f) => sum + f.guests * f.prix, 0);

  return (
    <main className="min-h-screen bg-cream px-4 py-10 text-blueDark">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <p className="font-specialElite text-lg">L&apos;Atelier de l&apos;Écharpe</p>
        <h1 className="mb-4 font-specialElite text-3xl">Demande de réservation</h1>

        <p className={`mb-6 inline-block rounded-full px-4 py-1 font-semibold ${STATUS_STYLE[r.status]}`}>
          {STATUS_LABELS[r.status]}
        </p>

        <dl className="mb-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-lg bg-gray-50 p-4">
          <dt className="font-semibold">Date</dt>
          <dd>
            {formatLongDate(r.date, "fr")} à {r.time.slice(0, 5)}
          </dd>
          <dt className="font-semibold">Personnes</dt>
          <dd>{r.covers}</dd>
          <dt className="font-semibold">Nom</dt>
          <dd>{r.name}</dd>
          {r.phone && (
            <>
              <dt className="font-semibold">Téléphone</dt>
              <dd>
                <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`} className="underline">
                  {r.phone}
                </a>
              </dd>
            </>
          )}
          {r.email && (
            <>
              <dt className="font-semibold">Email</dt>
              <dd className="break-all">{r.email}</dd>
            </>
          )}
          {r.notes && (
            <>
              <dt className="font-semibold">Commentaire</dt>
              <dd className="whitespace-pre-wrap">{r.notes}</dd>
            </>
          )}
        </dl>

        {formulas.length > 0 && (
          <table className="mb-6 w-full border-collapse">
            <caption className="mb-2 text-left text-xl font-semibold">Formule</caption>
            <thead>
              <tr className="bg-blueDark text-white">
                <th scope="col" className="p-2 text-left">Formule</th>
                <th scope="col" className="p-2 text-center">Qté</th>
                <th scope="col" className="p-2 text-right">PU</th>
                <th scope="col" className="p-2 text-right">Sous-total</th>
              </tr>
            </thead>
            <tbody>
              {formulas.map((f) => (
                <tr key={f.id}>
                  <td className="border p-2">{f.nom}</td>
                  <td className="border p-2 text-center">{f.guests}</td>
                  <td className="border p-2 text-right">{formatPrice(f.prix)}</td>
                  <td className="border p-2 text-right font-semibold">{formatPrice(f.guests * f.prix)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-blueDark font-bold text-white">
                <th scope="row" colSpan={3} className="p-2 text-right">Total</th>
                <td className="p-2 text-right">{formatPrice(total)}</td>
              </tr>
            </tfoot>
          </table>
        )}

        {r.status === "pending" ? (
          <DecisionForm token={r.token} hasEmail={Boolean(r.email)} />
        ) : (
          <p role="status" className="rounded-lg border-2 border-blueDark p-4 font-semibold">
            Déjà {r.status === "confirmed" ? "confirmée" : r.status === "refused" ? "refusée" : "annulée"}
            {r.decidedAt ? ` le ${formatDecidedAt(r.decidedAt.toISOString())}` : ""}. Aucune action supplémentaire.
          </p>
        )}
      </div>
    </main>
  );
}

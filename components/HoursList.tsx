import type { OpeningDay } from "@/db/schema";

function serviceLabel(closed: boolean, closedLabel: string, s: { debut: string; fin: string }) {
  return closed ? closedLabel : `${s.debut || "—"} - ${s.fin || "—"}`;
}

/** Liste des horaires d'ouverture (Server Component). */
export default function HoursList({
  hours,
  className,
}: {
  hours: OpeningDay[];
  className?: string;
}) {
  if (hours.length === 0) {
    return <p className={className}>Horaires non renseignés.</p>;
  }

  return (
    <ul className={className}>
      {hours.map((h) => (
        <li key={h.day} className="font-semibold">
          <strong>{h.day} :</strong>{" "}
          {h.closedDay ? (
            <span>fermé</span>
          ) : (
            <span>
              {serviceLabel(h.closedLunch, "fermé le midi", h.midi)}
              {" | "}
              {serviceLabel(h.closedDiner, "fermé le soir", h.soir)}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

// Règles de disponibilité partagées entre le formulaire (navigateur) et le serveur.
// Fonctions pures, sans dépendance serveur, travaillant sur des dates ISO `YYYY-MM-DD`.
import type { OpeningDay } from "@/db/schema";

export type HolidayRange = { debut: string; fin: string };

export type Availability = {
  hours: OpeningDay[];
  holidays: HolidayRange[];
  /** Jours complets (ISO). */
  closedDays: string[];
};

/** Fenêtres dans lesquelles on accepte des réservations, quels que soient les horaires d'ouverture. */
export const RESERVATION_LIMITS = {
  midi: { start: "12:00", end: "14:00" },
  soir: { start: "19:00", end: "23:00" },
} as const;

/** Les demandes du jour même sont fermées à partir de cette heure (heure de Paris). */
export const SAME_DAY_CUTOFF_HOUR = 16;
export const SLOT_STEP_MINUTES = 30;

/** À partir de ce nombre de personnes, la réservation de groupe avec formule est obligatoire. */
export const GROUP_THRESHOLD = 14;

const TIMEZONE = "Europe/Paris";

/** Date et heure courantes à Toulouse, indépendamment du fuseau du visiteur ou du serveur. */
export function parisNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return { date: `${get("year")}-${get("month")}-${get("day")}`, hour: Number(get("hour")) };
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Date locale (minuit) correspondant à une date ISO : pour les composants de calendrier. */
export function fromIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Index du jour dans le tableau des horaires : lundi = 0 … dimanche = 6. */
export function weekdayIndex(iso: string): number {
  const day = new Date(`${iso}T12:00:00Z`).getUTCDay();
  return day === 0 ? 6 : day - 1;
}

export function isHoliday(iso: string, holidays: HolidayRange[]) {
  return holidays.some((p) => p.debut <= iso && iso <= p.fin);
}

/** Jour de fermeture (hebdomadaire ou congés). Sans horaires renseignés, tout est fermé. */
export function isDayClosed(iso: string, { hours, holidays }: Availability) {
  const day = hours[weekdayIndex(iso)];
  if (!day || day.closedDay) return true;
  return isHoliday(iso, holidays);
}

const toMinutes = (time: string, afterMidnight = false) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m + (afterMidnight ? 24 * 60 : 0);
};

const twoDigits = (n: number) => n.toString().padStart(2, "0");

function generateSlots(start: string, end: string, limitStart: string, limitEnd: string) {
  // Une fermeture « avant » l'ouverture (ex. 02:00 après 19:00) passe minuit.
  const afterMidnight = Number(end.split(":")[0]) < Number(start.split(":")[0]);
  const effectiveStart = Math.max(toMinutes(start), toMinutes(limitStart));
  const effectiveEnd = Math.min(toMinutes(end, afterMidnight), toMinutes(limitEnd));

  const slots: string[] = [];
  for (let t = effectiveStart; t <= effectiveEnd; t += SLOT_STEP_MINUTES) {
    slots.push(`${twoDigits(Math.floor(t / 60) % 24)}:${twoDigits(t % 60)}`);
  }
  return slots;
}

/** Créneaux proposés pour un jour : horaires d'ouverture bornés par RESERVATION_LIMITS. */
export function getAvailableTimes(iso: string, hours: OpeningDay[]): string[] {
  const day = hours[weekdayIndex(iso)];
  if (!day || day.closedDay) return [];

  const times: string[] = [];
  if (!day.closedLunch && day.midi.debut && day.midi.fin) {
    times.push(
      ...generateSlots(day.midi.debut, day.midi.fin, RESERVATION_LIMITS.midi.start, RESERVATION_LIMITS.midi.end),
    );
  }
  if (!day.closedDiner && day.soir.debut && day.soir.fin) {
    times.push(
      ...generateSlots(day.soir.debut, day.soir.fin, RESERVATION_LIMITS.soir.start, RESERVATION_LIMITS.soir.end),
    );
  }
  return times;
}

export type SlotProblem = "past" | "tooLate" | "full" | "closed" | "time";

/** Premier problème rencontré pour une date (et une heure facultative), ou null si c'est réservable. */
export function findSlotProblem(
  iso: string,
  time: string | null,
  availability: Availability,
  now = parisNow(),
): SlotProblem | null {
  if (iso < now.date) return "past";
  if (iso === now.date && now.hour >= SAME_DAY_CUTOFF_HOUR) return "tooLate";
  if (availability.closedDays.includes(iso)) return "full";
  if (isDayClosed(iso, availability)) return "closed";
  if (time !== null && !getAvailableTimes(iso, availability.hours).includes(time)) return "time";
  return null;
}

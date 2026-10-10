import "server-only";
import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import type { OpeningDay } from "@/db/schema";

export type Formule = {
  id: number;
  nom: string;
  prix: number;
  description: string | null;
  elements: string[];
};

export type HolidayPeriod = { debut: string; fin: string };

/** Horaires des 7 jours (lundi → dimanche), tableau vide si non renseignés. */
export async function getOpeningHours(): Promise<OpeningDay[]> {
  const db = await getDb();
  const [row] = await db
    .select({ hours: schema.openingHours.hours })
    .from(schema.openingHours)
    .orderBy(asc(schema.openingHours.id))
    .limit(1);
  return row?.hours ?? [];
}

/** Formules de groupe actives, du prix le plus bas au plus haut. */
export async function getActiveFormules(): Promise<Formule[]> {
  const db = await getDb();
  return db
    .select({
      id: schema.formules.id,
      nom: schema.formules.nom,
      prix: schema.formules.prix,
      description: schema.formules.description,
      elements: schema.formules.elements,
    })
    .from(schema.formules)
    .where(eq(schema.formules.active, true))
    .orderBy(asc(schema.formules.prix), asc(schema.formules.id));
}

/** Périodes de congés (dates ISO `YYYY-MM-DD`). */
export async function getHolidayPeriods(): Promise<HolidayPeriod[]> {
  const db = await getDb();
  const rows = await db
    .select({ debut: schema.holidays.startDate, fin: schema.holidays.endDate })
    .from(schema.holidays)
    .orderBy(asc(schema.holidays.startDate));
  return rows;
}

/** Jours complets (dates ISO `YYYY-MM-DD`). */
export async function getClosedDays(): Promise<string[]> {
  const db = await getDb();
  const rows = await db
    .select({ day: schema.closedDays.day })
    .from(schema.closedDays)
    .orderBy(asc(schema.closedDays.day));
  return rows.map((r) => r.day);
}

export type MenuFile = { url: string; mimeType: string };

/** Fichiers de carte (PDF ou images) d'une catégorie, dans l'ordre d'affichage. */
export async function getMenuFiles(category: "brunch" | "diner" | "fiesta"): Promise<MenuFile[]> {
  const db = await getDb();
  return db
    .select({ url: schema.menuFiles.url, mimeType: schema.menuFiles.mimeType })
    .from(schema.menuFiles)
    .where(eq(schema.menuFiles.category, category))
    .orderBy(asc(schema.menuFiles.position), asc(schema.menuFiles.id));
}

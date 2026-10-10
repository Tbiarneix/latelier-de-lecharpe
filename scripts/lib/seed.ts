import { readFileSync } from "node:fs";
import path from "node:path";
import { getDb, schema } from "../../db/connect";
import type { OpeningDay } from "../../db/schema";

type SeedData = {
  openingHours: OpeningDay[];
  holidays: { debut: string; fin: string; label?: string }[];
  closedDays: string[];
  formules: {
    nom: string;
    prix: number;
    description?: string | null;
    elements?: string[];
    active?: boolean;
  }[];
  menuFiles: { category: "brunch" | "diner" | "fiesta"; url: string; pathname: string }[];
};

/** Importe db/seed-data.json. Renvoie false (sans rien faire) si la base contient déjà des données. */
export async function seedIfEmpty(): Promise<boolean> {
  const data: SeedData = JSON.parse(
    readFileSync(path.join(process.cwd(), "db", "seed-data.json"), "utf8"),
  );
  const db = await getDb();

  const existing = await db.select({ id: schema.openingHours.id }).from(schema.openingHours).limit(1);
  if (existing.length > 0) return false;

  await db.insert(schema.openingHours).values({ hours: data.openingHours });
  if (data.holidays.length) {
    await db.insert(schema.holidays).values(
      data.holidays.map((h) => ({ startDate: h.debut, endDate: h.fin, label: h.label ?? null })),
    );
  }
  if (data.closedDays.length) {
    await db.insert(schema.closedDays).values(data.closedDays.map((day) => ({ day })));
  }
  if (data.formules.length) {
    await db.insert(schema.formules).values(
      data.formules.map((f) => ({
        nom: f.nom,
        prix: f.prix,
        description: f.description ?? null,
        elements: f.elements ?? [],
        active: f.active ?? true,
      })),
    );
  }
  if (data.menuFiles.length) {
    await db.insert(schema.menuFiles).values(
      data.menuFiles.map((m, position) => ({ ...m, position })),
    );
  }
  return true;
}

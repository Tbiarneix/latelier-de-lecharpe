import { mkdirSync } from "node:fs";
import path from "node:path";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

export type Database = PgDatabase<PgQueryResultHKT, typeof schema>;

export const MIGRATIONS_FOLDER = path.join(process.cwd(), "drizzle");
export const PGLITE_DIR = path.join(process.cwd(), ".data", "pglite");

/**
 * Connexion à la base :
 * - `DATABASE_URL` définie (Neon, via l'intégration Vercel) → Neon en HTTP ;
 * - sinon → PGlite (Postgres embarqué, fichiers dans .data/pglite), uniquement hors production.
 *   Les migrations y sont appliquées automatiquement à la première connexion.
 */
async function connect(): Promise<Database> {
  const url = process.env.DATABASE_URL;

  if (url) {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    return drizzle(neon(url), { schema });
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL est requise en production.");
  }

  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  mkdirSync(path.dirname(PGLITE_DIR), { recursive: true });
  const db = drizzle(new PGlite(PGLITE_DIR), { schema });
  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
  return db as unknown as Database;
}

// Une seule connexion par processus (évite d'ouvrir PGlite plusieurs fois avec le HMR).
const globalForDb = globalThis as unknown as { __db?: Promise<Database> };

export function getDb(): Promise<Database> {
  globalForDb.__db ??= connect();
  return globalForDb.__db;
}

export { schema };

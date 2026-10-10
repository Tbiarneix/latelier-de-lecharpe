// Applique les migrations de ./drizzle sur la base courante :
// Neon si DATABASE_URL est définie, sinon PGlite local (.data/pglite).
import { getDb, MIGRATIONS_FOLDER } from "../db/connect";

async function main() {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { drizzle } = await import("drizzle-orm/neon-http");
    const { migrate } = await import("drizzle-orm/neon-http/migrator");
    const { neon } = await import("@neondatabase/serverless");
    await migrate(drizzle(neon(url)), { migrationsFolder: MIGRATIONS_FOLDER });
    console.log("Migrations appliquées sur Neon.");
  } else {
    await getDb(); // PGlite migre à la connexion
    console.log("Migrations appliquées sur PGlite (.data/pglite).");
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);

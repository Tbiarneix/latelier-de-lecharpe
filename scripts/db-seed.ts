// Importe db/seed-data.json. Refuse d'écraser une base déjà remplie,
// et demande --force pour écrire sur Neon (DATABASE_URL définie).
import { seedIfEmpty } from "./lib/seed";

async function main() {
  if (process.env.DATABASE_URL && !process.argv.includes("--force")) {
    throw new Error("DATABASE_URL est définie (Neon) : relancer avec --force pour importer.");
  }
  if (!(await seedIfEmpty())) {
    throw new Error("La base contient déjà des données : seed annulé (npm run db:reset en local).");
  }
  console.log("Seed terminé.");
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err.message ?? err);
    process.exit(1);
  },
);

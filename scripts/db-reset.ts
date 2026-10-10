// Supprime la base PGlite locale (.data/pglite). Ne touche jamais à Neon.
import { rmSync } from "node:fs";
import { PGLITE_DIR } from "../db/connect";

if (process.env.DATABASE_URL) {
  console.error("DATABASE_URL est définie : db:reset ne concerne que la base locale PGlite.");
  process.exit(1);
}
rmSync(PGLITE_DIR, { recursive: true, force: true });
console.log("Base locale supprimée. Relancer db:migrate puis db:seed.");

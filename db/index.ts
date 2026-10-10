import "server-only";

// Point d'entrée pour le code de l'application (Server Components, Server Actions).
// Les scripts (seed, migrations) importent directement ./connect.
export { getDb, schema } from "./connect";
export type { Database } from "./connect";

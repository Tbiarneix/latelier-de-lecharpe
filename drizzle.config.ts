import { defineConfig } from "drizzle-kit";

// Sert uniquement à `drizzle-kit generate` (migrations SQL versionnées dans ./drizzle).
// L'application des migrations passe par `npm run db:migrate` (PGlite en local, Neon sinon).
export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle",
});

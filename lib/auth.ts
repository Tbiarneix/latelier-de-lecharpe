import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { getDb, schema } from "@/db";

export const MIN_PASSWORD_LENGTH = 12;

async function createAuth() {
  const db = await getDb();

  return betterAuth({
    // BETTER_AUTH_SECRET et BETTER_AUTH_URL sont lus dans l'environnement.
    database: drizzleAdapter(db, { provider: "pg", schema }),
    emailAndPassword: {
      enabled: true,
      // Pas d'inscription publique : les comptes admin sont créés avec `npm run admin:create`.
      disableSignUp: true,
      minPasswordLength: MIN_PASSWORD_LENGTH,
      maxPasswordLength: 128,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    // Compteur en base : en serverless, la mémoire n'est pas partagée entre instances.
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 60,
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
        "/change-password": { window: 60, max: 5 },
      },
    },
    plugins: [nextCookies()],
  });
}

export type Auth = Awaited<ReturnType<typeof createAuth>>;

// La connexion à la base est asynchrone : on mémorise la promesse (une instance par processus).
const globalForAuth = globalThis as unknown as { __auth?: Promise<Auth> };

export function getAuth(): Promise<Auth> {
  globalForAuth.__auth ??= createAuth();
  return globalForAuth.__auth;
}

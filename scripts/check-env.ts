// Vérifie la configuration avant un déploiement de production.
// - VERCEL_ENV=production : une variable obligatoire manquante fait échouer le build.
// - Ailleurs (preview, local) : simple information.
import { LEGAL_MISSING } from "../lib/legal";

const REQUIRED: [string, string][] = [
  ["DATABASE_URL", "base Neon (intégration Vercel Marketplace)"],
  ["BETTER_AUTH_SECRET", "secret de session (openssl rand -base64 32)"],
  ["BETTER_AUTH_URL", "URL publique du site"],
  ["SITE_URL", "URL publique du site (liens des mails)"],
  ["BLOB_READ_WRITE_TOKEN", "stockage des cartes (Vercel Blob)"],
  ["SMTP_HOST", "serveur SMTP IONOS"],
  ["SMTP_USER", "boîte reservations@…"],
  ["SMTP_PASSWORD", "mot de passe de la boîte"],
  ["MAIL_TO_RESTAURANT", "boîte qui reçoit les demandes"],
  ["CRON_SECRET", "purge quotidienne des données"],
];

const isProduction = process.env.VERCEL_ENV === "production";
const missing = REQUIRED.filter(([name]) => !process.env[name]);

if (missing.length) {
  const lines = missing.map(([name, help]) => `  - ${name} : ${help}`).join("\n");
  if (isProduction) {
    console.error(`\nDéploiement de production bloqué : variables manquantes.\n${lines}\n`);
    process.exit(1);
  }
  console.log(`Variables non définies (acceptable hors production) :\n${lines}`);
}

if (isProduction && /localhost/.test(`${process.env.SITE_URL}${process.env.BETTER_AUTH_URL}`)) {
  console.error("\nSITE_URL / BETTER_AUTH_URL pointent vers localhost en production.\n");
  process.exit(1);
}

if (LEGAL_MISSING.length) {
  console.warn(
    `\n⚠ Mentions légales incomplètes (lib/legal.ts) : ${LEGAL_MISSING.join(", ")}. À renseigner avant la mise en ligne.\n`,
  );
}

console.log("Configuration vérifiée.");

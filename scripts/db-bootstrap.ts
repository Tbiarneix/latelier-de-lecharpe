// Amorçage optionnel au déploiement (appelé par `vercel-build`), piloté par des variables d'environnement.
// Sans ces variables : ne fait rien. Idempotent : ne modifie jamais un compte ou des données existants.
//   BOOTSTRAP_ADMIN_EMAIL + BOOTSTRAP_ADMIN_PASSWORD  → crée le compte admin s'il n'existe pas
//   BOOTSTRAP_SEED=true                               → importe db/seed-data.json si la base est vide
// À retirer des variables une fois l'amorçage fait.
import { upsertAdmin } from "./lib/admin";
import { seedIfEmpty } from "./lib/seed";

async function main() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (email && password) {
    const result = await upsertAdmin(email, process.env.BOOTSTRAP_ADMIN_NAME ?? email.split("@")[0], password, {
      resetIfExists: false,
    });
    console.log(
      result === "created"
        ? `Amorçage : compte administrateur créé pour ${email.toLowerCase()}.`
        : `Amorçage : le compte ${email.toLowerCase()} existe déjà, inchangé.`,
    );
  }

  if (process.env.BOOTSTRAP_SEED === "true") {
    console.log(
      (await seedIfEmpty())
        ? "Amorçage : données initiales importées (db/seed-data.json)."
        : "Amorçage : la base contient déjà des données, rien importé.",
    );
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err.message ?? err);
    process.exit(1);
  },
);

// Crée un compte administrateur, ou réinitialise son mot de passe s'il existe déjà.
//   npm run admin:create -- prenom@exemple.fr "Prénom Nom"
// Le mot de passe est demandé en saisie masquée (ou lu dans ADMIN_PASSWORD, pour l'automatisation).
// Sur Neon : définir DATABASE_URL (ex. `vercel env pull .env.local`).
import { upsertAdmin } from "./lib/admin";

function askHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const stdin = process.stdin;
    let value = "";
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    const onData = (char: string) => {
      if (char === "\u0003") process.exit(130); // Ctrl+C
      if (char === "\r" || char === "\n") {
        stdin.setRawMode?.(false);
        stdin.pause();
        stdin.off("data", onData);
        process.stdout.write("\n");
        resolve(value);
      } else if (char === "\u007f") {
        value = value.slice(0, -1);
      } else {
        value += char;
      }
    };
    stdin.on("data", onData);
  });
}

async function main() {
  const [email, ...nameParts] = process.argv.slice(2);
  if (!email?.includes("@")) {
    throw new Error('Usage : npm run admin:create -- adresse@exemple.fr "Prénom Nom"');
  }
  const name = nameParts.join(" ").trim() || email.split("@")[0];
  const password = process.env.ADMIN_PASSWORD ?? (await askHidden("Mot de passe : "));

  const result = await upsertAdmin(email, name, password, { resetIfExists: true });
  console.log(
    result === "created"
      ? `Compte administrateur créé pour ${email.toLowerCase()}.`
      : `Mot de passe mis à jour pour ${email.toLowerCase()} (sessions existantes fermées).`,
  );
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err.message ?? err);
    process.exit(1);
  },
);

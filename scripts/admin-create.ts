// Crée un compte administrateur, ou réinitialise son mot de passe s'il existe déjà.
//   npm run admin:create -- prenom@exemple.fr "Prénom Nom"
// Le mot de passe est demandé en saisie masquée (ou lu dans ADMIN_PASSWORD, pour l'automatisation).
// Sur Neon : définir DATABASE_URL (ex. `vercel env pull .env.local`).
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import { getDb, schema } from "../db/connect";

const MIN_PASSWORD_LENGTH = 12;

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
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Le mot de passe doit faire au moins ${MIN_PASSWORD_LENGTH} caractères.`);
  }
  const hash = await hashPassword(password);

  const db = await getDb();
  const address = email.toLowerCase();
  const [existing] = await db.select().from(schema.user).where(eq(schema.user.email, address));

  if (existing) {
    await db
      .update(schema.account)
      .set({ password: hash, updatedAt: new Date() })
      .where(eq(schema.account.userId, existing.id));
    await db.delete(schema.session).where(eq(schema.session.userId, existing.id));
    console.log(`Mot de passe mis à jour pour ${address} (sessions existantes fermées).`);
    return;
  }

  const id = crypto.randomUUID();
  await db.insert(schema.user).values({ id, name, email: address, emailVerified: true });
  await db.insert(schema.account).values({
    id: crypto.randomUUID(),
    accountId: id,
    providerId: "credential",
    userId: id,
    password: hash,
  });
  console.log(`Compte administrateur créé pour ${address}.`);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err.message ?? err);
    process.exit(1);
  },
);

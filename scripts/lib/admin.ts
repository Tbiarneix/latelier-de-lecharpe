import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import { getDb, schema } from "../../db/connect";

export const MIN_PASSWORD_LENGTH = 12;

/**
 * Crée un compte administrateur. S'il existe déjà : met à jour son mot de passe
 * seulement si `resetIfExists` est vrai (sinon ne touche à rien).
 * Renvoie ce qui s'est passé.
 */
export async function upsertAdmin(
  email: string,
  name: string,
  password: string,
  { resetIfExists }: { resetIfExists: boolean },
): Promise<"created" | "reset" | "exists"> {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Le mot de passe doit faire au moins ${MIN_PASSWORD_LENGTH} caractères.`);
  }

  const db = await getDb();
  const address = email.toLowerCase();
  const [existing] = await db.select().from(schema.user).where(eq(schema.user.email, address));

  if (existing) {
    if (!resetIfExists) return "exists";
    await db
      .update(schema.account)
      .set({ password: await hashPassword(password), updatedAt: new Date() })
      .where(eq(schema.account.userId, existing.id));
    await db.delete(schema.session).where(eq(schema.session.userId, existing.id));
    return "reset";
  }

  const id = crypto.randomUUID();
  await db.insert(schema.user).values({ id, name, email: address, emailVerified: true });
  await db.insert(schema.account).values({
    id: crypto.randomUUID(),
    accountId: id,
    providerId: "credential",
    userId: id,
    password: await hashPassword(password),
  });
  return "created";
}

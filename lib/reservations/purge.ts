import "server-only";
import { lt } from "drizzle-orm";
import { getDb, schema } from "@/db";

/** Durée de conservation d'une réservation, après sa date. Citée dans la politique de confidentialité. */
export const RETENTION_MONTHS = 12;

/**
 * Supprime les réservations plus anciennes que RETENTION_MONTHS, ainsi que les sessions expirées
 * et les compteurs de limitation périmés. Renvoie le nombre de réservations supprimées.
 */
export async function purgeOldData(now = new Date()): Promise<{ reservations: number }> {
  const db = await getDb();

  const limit = new Date(now);
  limit.setMonth(limit.getMonth() - RETENTION_MONTHS);
  const limitDate = limit.toISOString().slice(0, 10);

  const deleted = await db
    .delete(schema.reservations)
    .where(lt(schema.reservations.date, limitDate))
    .returning({ id: schema.reservations.id });

  await db.delete(schema.session).where(lt(schema.session.expiresAt, now));
  await db.delete(schema.verification).where(lt(schema.verification.expiresAt, now));
  await db.delete(schema.rateLimit).where(lt(schema.rateLimit.lastRequest, now.getTime() - 24 * 60 * 60 * 1000));

  return { reservations: deleted.length };
}

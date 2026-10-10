"use server";

import { revalidatePath } from "next/cache";
import { eq, max } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/db";
import type { FormState } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-session";
import { failure, success } from "@/lib/form-state";
import { deleteStoredFile, isTrustedFileUrl, MENU_ALLOWED_TYPES } from "@/lib/storage";

const registerInput = z.object({
  category: z.enum(["brunch", "diner", "fiesta"]),
  url: z.string().min(1).max(2000),
  pathname: z.string().min(1).max(500),
  mimeType: z.enum(MENU_ALLOWED_TYPES),
});

/** Enregistre en base un fichier déjà envoyé dans le stockage (Blob ou local). */
export async function registerMenuFile(input: z.input<typeof registerInput>): Promise<FormState> {
  await requireAdmin();

  const parsed = registerInput.safeParse(input);
  if (!parsed.success || !isTrustedFileUrl(parsed.data.url)) {
    return failure("Fichier refusé.");
  }
  const { category, url, pathname, mimeType } = parsed.data;

  const db = await getDb();
  const [{ last }] = await db
    .select({ last: max(schema.menuFiles.position) })
    .from(schema.menuFiles)
    .where(eq(schema.menuFiles.category, category));

  await db.insert(schema.menuFiles).values({ category, url, pathname, mimeType, position: (last ?? -1) + 1 });

  revalidatePath("/admin/cartes");
  return success("Fichier ajouté.");
}

export async function deleteMenuFile(id: number): Promise<FormState> {
  await requireAdmin();

  const db = await getDb();
  const [file] = await db.select().from(schema.menuFiles).where(eq(schema.menuFiles.id, id));
  if (!file) return failure("Ce fichier n'existe plus.");

  await db.delete(schema.menuFiles).where(eq(schema.menuFiles.id, id));
  await deleteStoredFile(file.url);

  revalidatePath("/admin/cartes");
  return success("Fichier supprimé.");
}

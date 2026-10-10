import "server-only";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { del } from "@vercel/blob";

export const MENU_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;
export const MENU_MAX_BYTES = 15 * 1024 * 1024;

const LOCAL_PREFIX = "/uploads/";

/**
 * - `blob`  : Vercel Blob (BLOB_READ_WRITE_TOKEN définie, production et preview) ;
 * - `local` : dossier public/uploads, uniquement hors production, pour développer sans token ;
 * - `none`  : rien de configuré en production → l'envoi de fichiers est désactivé.
 */
export function storageMode(): "blob" | "local" | "none" {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  return process.env.NODE_ENV === "production" ? "none" : "local";
}

export function isLocalUploadUrl(url: string) {
  return url.startsWith(LOCAL_PREFIX) && !url.includes("..");
}

/** Une URL enregistrée en base doit venir de notre stockage, pas de n'importe où. */
export function isTrustedFileUrl(url: string) {
  if (isLocalUploadUrl(url)) return storageMode() === "local";
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export function localUploadDir() {
  return path.join(process.cwd(), "public", "uploads", "menus");
}

/** Supprime le fichier du stockage ; ne lève pas si le fichier n'existe plus. */
export async function deleteStoredFile(url: string) {
  try {
    if (isLocalUploadUrl(url)) {
      await unlink(path.join(process.cwd(), "public", url));
    } else if (process.env.BLOB_READ_WRITE_TOKEN) {
      await del(url);
    }
  } catch (err) {
    console.error("Suppression du fichier impossible :", err);
  }
}

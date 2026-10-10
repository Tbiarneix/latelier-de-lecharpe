import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/admin-session";
import { localUploadDir, MENU_ALLOWED_TYPES, MENU_MAX_BYTES, storageMode } from "@/lib/storage";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

// Repli de développement quand BLOB_READ_WRITE_TOKEN n'est pas définie.
export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  if (storageMode() !== "local") {
    return NextResponse.json({ error: "Envoi local désactivé" }, { status: 404 });
  }

  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
  }
  if (!(MENU_ALLOWED_TYPES as readonly string[]).includes(file.type)) {
    return NextResponse.json({ error: "Type de fichier non accepté" }, { status: 400 });
  }
  if (file.size > MENU_MAX_BYTES) {
    return NextResponse.json({ error: "Fichier trop volumineux (15 Mo maximum)" }, { status: 400 });
  }

  // Le nom d'origine n'est jamais réutilisé tel quel : pas de traversée de répertoire.
  const name = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${EXTENSIONS[file.type]}`;
  await mkdir(localUploadDir(), { recursive: true });
  await writeFile(path.join(localUploadDir(), name), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/menus/${name}`, pathname: `menus/${name}`, contentType: file.type });
}

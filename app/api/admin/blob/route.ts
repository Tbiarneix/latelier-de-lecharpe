import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSession } from "@/lib/admin-session";
import { MENU_ALLOWED_TYPES, MENU_MAX_BYTES } from "@/lib/storage";

// Génère un jeton d'envoi direct navigateur → Vercel Blob (évite la limite de 4,5 Mo des fonctions).
export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [...MENU_ALLOWED_TYPES],
        maximumSizeInBytes: MENU_MAX_BYTES,
        addRandomSuffix: true,
      }),
      // L'enregistrement en base se fait par une Server Action après l'envoi
      // (ce rappel ne peut pas joindre localhost en développement).
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

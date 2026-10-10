import { NextResponse } from "next/server";
import { purgeOldData } from "@/lib/reservations/purge";

// Appelée chaque jour par Vercel Cron (vercel.json). Vercel envoie `Authorization: Bearer $CRON_SECRET`.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const result = await purgeOldData();
  return NextResponse.json({ ok: true, ...result });
}

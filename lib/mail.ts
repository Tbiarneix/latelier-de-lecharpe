import "server-only";
import nodemailer from "nodemailer";

export type Mail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type MailResult = { ok: true; dev?: boolean } | { ok: false; error: string };

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

/**
 * Unique point d'envoi des mails (SMTP IONOS via Nodemailer). Ne lève jamais : un échec d'envoi
 * est renvoyé pour être enregistré (mail_status) sans perdre la réservation.
 * Hors production et sans SMTP configuré, le mail est simplement affiché dans la console.
 */
export async function sendMail(mail: Mail): Promise<MailResult> {
  if (!smtpConfigured()) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: "SMTP non configuré (SMTP_HOST, SMTP_USER, SMTP_PASSWORD)." };
    }
    console.log(`\n[mail:dev] À : ${mail.to}\n[mail:dev] Objet : ${mail.subject}\n${mail.text}\n`);
    return { ok: true, dev: true };
  }

  try {
    const port = Number(process.env.SMTP_PORT ?? 587);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      // 465 = TLS implicite ; 587 = STARTTLS obligatoire.
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? `"L'Atelier de l'Écharpe" <${process.env.SMTP_USER}>`,
      to: mail.to,
      replyTo: mail.replyTo,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
    return { ok: true };
  } catch (err) {
    console.error("Échec d'envoi du mail :", err);
    return { ok: false, error: (err as Error).message };
  }
}

/** Destinataire des demandes de réservation (boîte du restaurant). */
export function restaurantAddress(): string | null {
  return process.env.MAIL_TO_RESTAURANT ?? null;
}

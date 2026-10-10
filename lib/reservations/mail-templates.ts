import type { schema } from "@/db";
import { siteUrl } from "@/lib/site-url";
import { formatLongDate, toLocale, type Locale } from "./locales";

export type Reservation = typeof schema.reservations.$inferSelect;
export type ClientMailKind = "pending" | "confirmed" | "refused" | "cancelled" | "modified";

const BLUE = "#201C5C";
const CREAM = "#FBE9D5";
const PHONE = "+33 5 34 30 93 35";
const ADDRESS = "8 rue de l'Écharpe, 31000 Toulouse";

/** Échappe toute donnée saisie par un visiteur avant de l'insérer dans du HTML. */
export function esc(value: string | number | null | undefined): string {
  return String(value ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

type Copy = {
  subject: Record<ClientMailKind, string>;
  status: Record<ClientMailKind, string>;
  body: Record<ClientMailKind, string>;
  hello: (name: string) => string;
  labels: {
    date: string;
    time: string;
    covers: string;
    name: string;
    phone: string;
    notes: string;
    formula: string;
    quantity: string;
    unitPrice: string;
    subtotal: string;
    total: string;
    reservation: string;
  };
  contact: string;
};

// FR : textes repris des mails existants (EmailJS) ; EN/ES/IT : traductions.
// « cancelled » et « modified » sont nouveaux (étape 5).
const COPY: Record<Locale, Copy> = {
  fr: {
    subject: {
      pending: "Votre demande de réservation – L'Atelier de l'Écharpe",
      confirmed: "Réservation confirmée – L'Atelier de l'Écharpe",
      refused: "Votre demande de réservation – L'Atelier de l'Écharpe",
      cancelled: "Réservation annulée – L'Atelier de l'Écharpe",
      modified: "Réservation modifiée – L'Atelier de l'Écharpe",
    },
    status: {
      pending: "EN ATTENTE DE CONFIRMATION",
      confirmed: "CONFIRMÉE",
      refused: "REFUSÉE",
      cancelled: "ANNULÉE",
      modified: "MODIFIÉE",
    },
    body: {
      pending:
        "Nous avons bien pris en compte votre demande et elle sera traitée dans les plus brefs délais. Veuillez noter que votre réservation ne sera confirmée qu’une fois que vous aurez reçu un mail de confirmation de notre part. Nous vous remercions pour votre patience et sommes impatients de vous accueillir !",
      confirmed:
        "Merci beaucoup pour votre réservation ! Nous sommes heureux de vous informer que votre demande a été confirmée. Nous avons hâte de vous accueillir au restaurant pour passer un agréable moment ensemble. À très bientôt !",
      refused:
        "Nous vous remercions pour votre demande. Malheureusement, nous ne pouvons pas l'accepter. Merci de votre compréhension.",
      cancelled:
        "Nous sommes au regret de vous informer que votre réservation a été annulée. N'hésitez pas à nous contacter pour en convenir autrement.",
      modified:
        "Votre réservation a été modifiée. Vous trouverez ci-dessous les nouvelles informations. À très bientôt !",
    },
    hello: (name) => `Bonjour ${name},`,
    labels: {
      date: "Date", time: "Heure", covers: "Personnes", name: "Nom", phone: "Téléphone", notes: "Commentaire",
      formula: "Formule", quantity: "Qté", unitPrice: "PU", subtotal: "Sous-total", total: "TOTAL",
      reservation: "Votre réservation",
    },
    contact: "Une question ? Appelez-nous ou répondez à ce mail.",
  },
  en: {
    subject: {
      pending: "Your reservation request – L'Atelier de l'Écharpe",
      confirmed: "Reservation confirmed – L'Atelier de l'Écharpe",
      refused: "Your reservation request – L'Atelier de l'Écharpe",
      cancelled: "Reservation cancelled – L'Atelier de l'Écharpe",
      modified: "Reservation updated – L'Atelier de l'Écharpe",
    },
    status: {
      pending: "AWAITING CONFIRMATION",
      confirmed: "CONFIRMED",
      refused: "DECLINED",
      cancelled: "CANCELLED",
      modified: "UPDATED",
    },
    body: {
      pending:
        "We have received your request and will process it as soon as possible. Please note that your reservation is only confirmed once you have received a confirmation email from us. Thank you for your patience, we look forward to welcoming you!",
      confirmed:
        "Thank you very much for your reservation! We are pleased to inform you that your request has been confirmed. We look forward to welcoming you to the restaurant for an enjoyable time together. See you soon!",
      refused:
        "Thank you for your request. Unfortunately, we are unable to accept it. Thank you for your understanding.",
      cancelled:
        "We regret to inform you that your reservation has been cancelled. Please feel free to contact us to arrange something else.",
      modified:
        "Your reservation has been updated. Please find the new details below. See you soon!",
    },
    hello: (name) => `Hello ${name},`,
    labels: {
      date: "Date", time: "Time", covers: "Guests", name: "Name", phone: "Phone", notes: "Comment",
      formula: "Package", quantity: "Qty", unitPrice: "Unit price", subtotal: "Subtotal", total: "TOTAL",
      reservation: "Your reservation",
    },
    contact: "Any question? Call us or reply to this email.",
  },
  es: {
    subject: {
      pending: "Su solicitud de reserva – L'Atelier de l'Écharpe",
      confirmed: "Reserva confirmada – L'Atelier de l'Écharpe",
      refused: "Su solicitud de reserva – L'Atelier de l'Écharpe",
      cancelled: "Reserva cancelada – L'Atelier de l'Écharpe",
      modified: "Reserva modificada – L'Atelier de l'Écharpe",
    },
    status: {
      pending: "PENDIENTE DE CONFIRMACIÓN",
      confirmed: "CONFIRMADA",
      refused: "RECHAZADA",
      cancelled: "CANCELADA",
      modified: "MODIFICADA",
    },
    body: {
      pending:
        "Hemos recibido su solicitud y la trataremos lo antes posible. Tenga en cuenta que su reserva solo quedará confirmada cuando reciba un correo de confirmación por nuestra parte. Gracias por su paciencia, ¡esperamos recibirle pronto!",
      confirmed:
        "¡Muchas gracias por su reserva! Nos complace informarle de que su solicitud ha sido confirmada. Estamos deseando recibirle en el restaurante para pasar un rato agradable juntos. ¡Hasta muy pronto!",
      refused:
        "Le agradecemos su solicitud. Lamentablemente, no podemos aceptarla. Gracias por su comprensión.",
      cancelled:
        "Lamentamos informarle de que su reserva ha sido cancelada. No dude en contactarnos para acordar otra opción.",
      modified:
        "Su reserva ha sido modificada. A continuación encontrará los nuevos datos. ¡Hasta pronto!",
    },
    hello: (name) => `Hola ${name}:`,
    labels: {
      date: "Fecha", time: "Hora", covers: "Personas", name: "Nombre", phone: "Teléfono", notes: "Comentario",
      formula: "Fórmula", quantity: "Cant.", unitPrice: "P. unit.", subtotal: "Subtotal", total: "TOTAL",
      reservation: "Su reserva",
    },
    contact: "¿Alguna pregunta? Llámenos o responda a este correo.",
  },
  it: {
    subject: {
      pending: "La tua richiesta di prenotazione – L'Atelier de l'Écharpe",
      confirmed: "Prenotazione confermata – L'Atelier de l'Écharpe",
      refused: "La tua richiesta di prenotazione – L'Atelier de l'Écharpe",
      cancelled: "Prenotazione annullata – L'Atelier de l'Écharpe",
      modified: "Prenotazione modificata – L'Atelier de l'Écharpe",
    },
    status: {
      pending: "IN ATTESA DI CONFERMA",
      confirmed: "CONFERMATA",
      refused: "RIFIUTATA",
      cancelled: "ANNULLATA",
      modified: "MODIFICATA",
    },
    body: {
      pending:
        "Abbiamo ricevuto la tua richiesta e la tratteremo il prima possibile. Tieni presente che la prenotazione sarà confermata solo dopo aver ricevuto una email di conferma da parte nostra. Grazie per la pazienza, non vediamo l'ora di accoglierti!",
      confirmed:
        "Grazie mille per la tua prenotazione! Siamo lieti di informarti che la tua richiesta è stata confermata. Non vediamo l'ora di accoglierti al ristorante per trascorrere insieme un piacevole momento. A presto!",
      refused:
        "Ti ringraziamo per la tua richiesta. Purtroppo non possiamo accettarla. Grazie per la comprensione.",
      cancelled:
        "Ci dispiace informarti che la tua prenotazione è stata annullata. Non esitare a contattarci per accordarci diversamente.",
      modified:
        "La tua prenotazione è stata modificata. Qui sotto trovi i nuovi dettagli. A presto!",
    },
    hello: (name) => `Ciao ${name},`,
    labels: {
      date: "Data", time: "Ora", covers: "Persone", name: "Nome", phone: "Telefono", notes: "Commento",
      formula: "Formula", quantity: "Qtà", unitPrice: "Prezzo unit.", subtotal: "Subtotale", total: "TOTALE",
      reservation: "La tua prenotazione",
    },
    contact: "Una domanda? Chiamaci o rispondi a questa email.",
  },
};

export const formatPrice = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(2)} €`;

function formulaRows(r: Reservation) {
  const rows = r.formules ?? [];
  const total = rows.reduce((sum, f) => sum + f.guests * f.prix, 0);
  return { rows, total };
}

function detailLines(r: Reservation, labels: Copy["labels"], locale: Locale) {
  const lines: [string, string][] = [
    [labels.date, formatLongDate(r.date, locale)],
    [labels.time, r.time.slice(0, 5)],
    [labels.covers, String(r.covers)],
    [labels.name, r.name],
  ];
  if (r.phone) lines.push([labels.phone, r.phone]);
  if (r.notes) lines.push([labels.notes, r.notes]);
  return lines;
}

function detailsHtml(r: Reservation, labels: Copy["labels"], locale: Locale) {
  const rows = detailLines(r, labels, locale)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#555;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;font-weight:bold">${esc(v)}</td></tr>`,
    )
    .join("");

  const { rows: formulas, total } = formulaRows(r);
  const table = formulas.length
    ? `<table style="width:100%;border-collapse:collapse;margin-top:16px">
        <thead><tr style="background:${BLUE};color:#fff">
          <th style="padding:8px;text-align:left">${esc(labels.formula)}</th>
          <th style="padding:8px;text-align:center">${esc(labels.quantity)}</th>
          <th style="padding:8px;text-align:right">${esc(labels.unitPrice)}</th>
          <th style="padding:8px;text-align:right">${esc(labels.subtotal)}</th></tr></thead>
        <tbody>${formulas
          .map(
            (f) =>
              `<tr><td style="padding:8px;border:1px solid #ddd">${esc(f.nom)}</td><td style="padding:8px;border:1px solid #ddd;text-align:center">${f.guests}</td><td style="padding:8px;border:1px solid #ddd;text-align:right">${esc(formatPrice(f.prix))}</td><td style="padding:8px;border:1px solid #ddd;text-align:right">${esc(formatPrice(f.guests * f.prix))}</td></tr>`,
          )
          .join("")}</tbody>
        <tfoot><tr style="background:${BLUE};color:#fff;font-weight:bold"><td colspan="3" style="padding:8px;text-align:right">${esc(labels.total)}</td><td style="padding:8px;text-align:right">${esc(formatPrice(total))}</td></tr></tfoot>
      </table>`
    : "";

  return `<table style="border-collapse:collapse">${rows}</table>${table}`;
}

function detailsText(r: Reservation, labels: Copy["labels"], locale: Locale) {
  const lines = detailLines(r, labels, locale).map(([k, v]) => `${k} : ${v}`);
  const { rows, total } = formulaRows(r);
  for (const f of rows) lines.push(`${labels.formula} : ${f.nom} × ${f.guests} (${formatPrice(f.prix)})`);
  if (rows.length) lines.push(`${labels.total} : ${formatPrice(total)}`);
  return lines.join("\n");
}

function layout(title: string, inner: string) {
  return `<!doctype html><html><body style="margin:0;background:${CREAM};font-family:Arial,Helvetica,sans-serif;color:${BLUE}">
  <div style="max-width:600px;margin:0 auto;padding:24px">
    <h1 style="font-size:22px;margin:0 0 16px">L'Atelier de l'Écharpe</h1>
    <div style="background:#fff;border-radius:8px;padding:24px">${inner}</div>
    <p style="font-size:13px;color:#555;margin-top:16px">${esc(title)}<br>${esc(ADDRESS)} · ${esc(PHONE)}</p>
  </div></body></html>`;
}

/** Mail adressé au client, dans la langue de son formulaire. */
export function renderClientMail(r: Reservation, kind: ClientMailKind) {
  const locale = toLocale(r.locale);
  const c = COPY[locale];
  const html = layout(
    c.contact,
    `<p>${esc(c.hello(r.name))}</p>
     <p style="display:inline-block;background:${BLUE};color:#fff;padding:6px 12px;border-radius:4px;font-weight:bold">${esc(c.status[kind])}</p>
     <p style="line-height:1.5">${esc(c.body[kind])}</p>
     <h2 style="font-size:16px;margin:24px 0 8px">${esc(c.labels.reservation)}</h2>
     ${detailsHtml(r, c.labels, locale)}`,
  );
  const text = [
    c.hello(r.name),
    "",
    c.status[kind],
    "",
    c.body[kind],
    "",
    `${c.labels.reservation} :`,
    detailsText(r, c.labels, locale),
    "",
    `${c.contact} ${PHONE}`,
    `L'Atelier de l'Écharpe — ${ADDRESS}`,
  ].join("\n");
  return { subject: c.subject[kind], html, text };
}

/** Mail adressé au restaurant : toujours en français, avec le lien vers la page de traitement. */
export function renderRestaurantMail(r: Reservation) {
  const c = COPY.fr;
  const link = `${siteUrl()}/r/${r.token}`;
  const kind = r.type === "group" ? "groupe avec formule" : "table";
  const subject = `Nouvelle demande de réservation – ${r.name}, ${r.covers} pers., ${formatLongDate(r.date, "fr")} à ${r.time.slice(0, 5)}`;

  const contact = [r.phone ? `Téléphone : ${r.phone}` : null, r.email ? `Email : ${r.email}` : null].filter(Boolean);
  const html = layout(
    "Cette demande est en attente de votre réponse.",
    `<p style="font-size:16px"><strong>Nouvelle demande de réservation</strong> (${esc(kind)})</p>
     ${detailsHtml(r, c.labels, "fr")}
     ${r.email ? `<p style="color:#555">Email : ${esc(r.email)}</p>` : ""}
     <p style="margin:24px 0"><a href="${esc(link)}" style="background:${BLUE};color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold">Traiter la demande</a></p>
     <p style="font-size:13px;color:#555">Le lien ouvre la demande ; vous y choisissez de la valider ou de la refuser. Le client est prévenu par mail.</p>`,
  );
  const text = [
    `Nouvelle demande de réservation (${kind})`,
    "",
    detailsText(r, c.labels, "fr"),
    ...contact,
    "",
    `Traiter la demande : ${link}`,
  ].join("\n");
  return { subject, html, text };
}

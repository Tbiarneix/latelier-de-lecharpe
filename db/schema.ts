import {
  bigint,
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  time,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* -------------------------------------------------------------------------- */
/*  Types JSON                                                                */
/* -------------------------------------------------------------------------- */

/** Un service (midi ou soir). Chaînes vides = non renseigné. */
export type OpeningService = { debut: string; fin: string };

/** Horaires d'un jour (même forme que l'ancien schéma Supabase). */
export type OpeningDay = {
  day: string;
  closedDay: boolean;
  closedLunch: boolean;
  closedDiner: boolean;
  midi: OpeningService;
  soir: OpeningService;
};

/** Formules choisies pour une réservation de groupe. */
export type ReservationFormula = { id: number; nom: string; prix: number; guests: number };

/* -------------------------------------------------------------------------- */
/*  Contenu du site                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Horaires d'ouverture : une seule ligne (id = 1), 7 jours du lundi au dimanche.
 */
export const openingHours = pgTable("opening_hours", {
  id: serial("id").primaryKey(),
  hours: jsonb("hours").$type<OpeningDay[]>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Périodes de congés (fermeture sur plusieurs jours). */
export const holidays = pgTable("holidays", {
  id: serial("id").primaryKey(),
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }).notNull(),
  label: text("label"),
});

/** Jours « complets » : le restaurant n'accepte plus de réservation ce jour-là. */
export const closedDays = pgTable("closed_days", {
  day: date("day", { mode: "string" }).primaryKey(),
});

/** Formules de groupe. */
export const formules = pgTable("formules", {
  id: serial("id").primaryKey(),
  nom: text("nom").notNull(),
  prix: numeric("prix", { precision: 7, scale: 2, mode: "number" }).notNull(),
  description: text("description"),
  elements: jsonb("elements").$type<string[]>().notNull().default([]),
  active: boolean("active").notNull().default(true),
});

export const menuCategory = pgEnum("menu_category", ["brunch", "diner", "fiesta"]);

/** Fichiers de carte (PDF ou images) hébergés sur Vercel Blob. */
export const menuFiles = pgTable(
  "menu_files",
  {
    id: serial("id").primaryKey(),
    category: menuCategory("category").notNull(),
    /** URL publique du fichier. */
    url: text("url").notNull(),
    /** Chemin dans le stockage (sert à supprimer le fichier). */
    pathname: text("pathname").notNull(),
    /** Type MIME (image/jpeg, application/pdf…) : choisit le rendu côté site. */
    mimeType: text("mime_type").notNull().default("image/jpeg"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("menu_files_category_idx").on(t.category, t.position)],
);

/* -------------------------------------------------------------------------- */
/*  Réservations                                                              */
/* -------------------------------------------------------------------------- */

export const reservationStatus = pgEnum("reservation_status", [
  "pending",
  "confirmed",
  "refused",
  "cancelled",
]);
export const reservationType = pgEnum("reservation_type", ["table", "group"]);
export const mailStatus = pgEnum("mail_status", ["pending", "sent", "partial", "failed"]);

export const reservations = pgTable(
  "reservations",
  {
    id: serial("id").primaryKey(),
    status: reservationStatus("status").notNull().default("pending"),
    type: reservationType("type").notNull().default("table"),
    date: date("date", { mode: "string" }).notNull(),
    time: time("time").notNull(),
    covers: integer("covers").notNull(),
    name: text("name").notNull(),
    /** Facultatif : une réservation prise par téléphone peut ne pas en avoir. */
    email: text("email"),
    phone: text("phone"),
    notes: text("notes"),
    formules: jsonb("formules").$type<ReservationFormula[]>(),
    /** Langue du formulaire (fr, en, es, it) : sert à répondre dans la même langue. */
    locale: text("locale").notNull().default("fr"),
    /** Jeton aléatoire non devinable pour la page /r/[token]. */
    token: text("token").notNull(),
    /** pending = pas encore tenté ; sent ; partial = un des deux mails a échoué ; failed. */
    mailStatus: mailStatus("mail_status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("reservations_token_idx").on(t.token),
    index("reservations_date_idx").on(t.date, t.time),
    index("reservations_status_idx").on(t.status),
  ],
);

/* -------------------------------------------------------------------------- */
/*  Better Auth (schéma de base, étape 3)                                     */
/* -------------------------------------------------------------------------- */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

/** Limitation de débit (tentatives de connexion) : stockée en base car le serverless n'a pas de mémoire partagée. */
export const rateLimit = pgTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

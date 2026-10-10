# CLAUDE.md — L'Atelier de l'Écharpe

Site du restaurant L'Atelier de l'Écharpe (Toulouse) — https://www.latelierdelecharpe.fr
Repo = fork du code de l'ancien prestataire. Objectif : reproduire le site à l'identique,
puis le rendre autonome (comptes au nom de la cliente) et plus simple à gérer pour elle.

Développeur : front Next/TypeScript, spécialisé accessibilité (RGAA/WCAG).
**Le code doit être accessible par défaut** : sémantique, focus, labels, contrastes, `lang`.

## Façon de travailler
- Une branche + une PR par étape, commits en français.
- Demander avant tout choix qui contredit les décisions ci-dessous.
- Aucune clé secrète en dur ; `.env.example` documenté et à jour.
- Garder ce fichier à jour (état des étapes, décisions).

## Existant (hérité)
- Next.js App Router, Tailwind 3, shadcn/ui, Framer Motion.
- Supabase mutualisé (ancien prestataire), schéma `latelier_de_lecharpe` : opening_hours, holidays,
  closed_days, formules, menu_files, profiles + bucket `menus`. **Va disparaître complètement.**
- Carte = PDF/images par catégorie brunch / diner / fiesta.
- /admin (Supabase Auth) : upload des menus + jours complets ; ScheduleChange, HolidaysChange,
  GroupFormulas codés mais commentés.
- Réservation : `components/ContactFormV2.tsx` → EmailJS côté navigateur (mail restaurant + accusé client).
  Le mail restaurant lie `/reservation-autoreply?nom=…&email=…&tel=…` (données perso dans l'URL, page
  publique) avec VALIDER / REFUSER. Rien n'est stocké.

## Décisions d'architecture (validées)
- Hébergement : Vercel (compte de la cliente).
- Base : Postgres Neon via Vercel Marketplace (`DATABASE_URL`). ORM Drizzle (schéma TS + migrations
  versionnées). Dev local : PGlite (pas de Docker).
- Fichiers (PDF de la carte) : Vercel Blob.
- Auth back-office : Better Auth, email + mot de passe, adapter Drizzle (1 à 2 admins).
- Mails : Nodemailer + SMTP IONOS (reservations@latelierdelecharpe.fr). Pas de Resend ni EmailJS.
  Envoi isolé dans `sendMail()` ; en dev, log console.
  Variables : `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_TO_RESTAURANT`.
- Supabase et EmailJS supprimés à la fin.
- Données actuelles (horaires, formules, textes) : ressaisies à la main / fournies par le dev ;
  pas d'export Supabase prévu (pas d'accès aux clés).

## Plan (état)
1. **Mise à jour Next 16 / React 19** — FAIT (PR #1, branche `chore/upgrade-next`).
   Note : `next.config.js` désactive `agentRules` (pas d'AGENTS.md généré).
2. **Données** — FAIT (branche `feat/donnees`, empilée sur la PR 1). Schéma Drizzle : opening_hours, holidays, closed_days, formules, menu_files,
   reservations, tables Better Auth. `reservations` : id, status (pending|confirmed|refused|cancelled),
   type (table|group), date, time, covers, name, email, phone, notes, formules (jsonb), locale,
   token (aléatoire, unique), mail_status, created_at, updated_at, decided_at.
   PGlite en dev / Neon en prod, script de seed. Lectures du site public en Server Components
   (fin des « Chargement… »).
   Choix : mono-restaurant (pas de `restaurant_id`) ; `holidays` (start_date/end_date) et `closed_days`
   (day) en lignes ; `opening_hours` reste en jsonb (7 jours) ; `menu_files` = url + pathname + position.
   Tables Better Auth écrites à la main (user/session/account/verification) : à comparer avec
   `npx @better-auth/cli generate` à l'étape 3. Pages publiques en `force-dynamic` (à revoir avec du
   cache + revalidation à l'étape 3, quand l'admin écrira).
3. **Back-office** — FAIT (branche `feat/back-office`, empilée). Better Auth, /admin protégé (proxy + vérif serveur), upload PDF sur
   Vercel Blob, horaires + congés + formules + jours complets. Mobile-first, accessible, en français.
4. **Réservation** — FAIT (branche `feat/reservation`, empilée). Server Action + Zod + honeypot. Enregistrer d'abord (pending), puis mails
   (restaurant + accusé) ; un échec de mail ne perd jamais la réservation (mail_status + bouton
   « renvoyer »). Le mail lie `/r/[token]` (aucune donnée perso dans l'URL) avec VALIDER / REFUSER
   par bouton POST / Server Action, **jamais** par lien GET (scanners antivirus). Idempotence :
   « Déjà confirmée le … ». 4 langues (FR, EN, ES, IT) et textes de mails existants.
   URL de base via variable d'env (plus de `latelier-de-lecharpe.vercel.app` en dur).
5. **Gestion des réservations (admin)** — FAIT (branche `feat/gestion-reservations`, empilée). Cible : « Aujourd'hui / À venir », filtre statut, annuler, modifier,
   ajout manuel (téléphone → confirmée, email facultatif), case « prévenir le client ».
6. **Accessibilité, SEO, RGPD** — FAIT (branche `feat/accessibilite-rgpd`, empilée). Passe RGAA (h1 découpé en h1/h2/h3 sur l'accueil, sélecteur de langue
   en emoji sans libellé ni `lang`, formulaires, focus, contrastes), purge des réservations > 12 mois,
   mentions RGPD.
7. **Bascule** — PRÉPARÉE dans le dépôt (branche `feat/bascule`) : `docs/mise-en-production.md`, `npm run check:env` (bloque un déploiement de production incomplet), `vercel-build` = check:env + db:migrate + next build. Les actions sur comptes/DNS restent à faire avec la cliente. Plan initial : variables de prod Vercel, migration Neon, import des données, SMTP IONOS, recette,
   TTL DNS abaissé puis bascule chez IONOS (noter les MX existants avant).

## Back-office (étape 3)
- Sections : `/admin` (accueil), `cartes`, `horaires`, `conges`, `jours-complets`, `formules`, `compte`
  (`app/admin/(panel)/…`). Server Actions + Zod ; formulaires via `useAdminForm` (`components/admin/ui.tsx`).
- Auth : `lib/auth.ts` (Better Auth, pas d'inscription, rate limit en base), `lib/admin-session.ts`
  (`requireAdmin()` à appeler dans CHAQUE page/action/route admin), `proxy.ts` (filtre optimiste par cookie).
- Comptes : `npm run admin:create -- email "Nom"` (crée ou réinitialise le mot de passe). Pas d'email de reset
  avant l'étape 4 (SMTP).
- Cartes : envoi direct navigateur → Vercel Blob (`/api/admin/blob`), puis `registerMenuFile`. Sans
  `BLOB_READ_WRITE_TOKEN` hors prod : repli `public/uploads` (`/api/admin/menu-upload`). Le site public affiche
  images et PDF (`components/menu/MenuFiles.tsx`).
- Piège : `changePassword({ revokeOtherSessions: true })` remplace le jeton courant et casse le rendu qui suit
  l'action ; on appelle `revokeOtherSessions` séparément.
- Pages publiques toujours en `force-dynamic` (choix : les modifications admin sont visibles tout de suite).
- Variables : `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BLOB_READ_WRITE_TOKEN`.

## Réservation (étape 4)
- Formulaire : `components/reservation/` (4 langues FR/EN/ES/IT, labels associés, `<select>` de créneaux,
  radios, honeypot `website`). Règles de créneaux partagées navigateur/serveur : `lib/reservations/availability.ts`
  (heure de Paris, fin des demandes du jour à 16h, fenêtres midi 12-14h / soir 19-23h, pas de 30 min).
- `app/reservation/actions.ts` : Zod, revalidation serveur du créneau, formule relue en base, frein anti-spam
  (3 demandes/h/email), réservation ≥ 14 personnes → groupe avec formule obligatoire (si des formules sont actives).
  La réservation est enregistrée AVANT les mails ; échec → `mail_status` partial/failed, jamais fatal.
- Mails : `lib/mail.ts` (`sendMail`, SMTP IONOS ; log console hors prod sans SMTP), gabarits dans
  `lib/reservations/mail-templates.ts` (FR repris des mails EmailJS, EN/ES/IT traduits ; données saisies
  échappées). Restaurant : toujours FR, lien `/r/[token]` (GET sans effet).
- `/r/[token]` : décision par boutons (Server Action POST), `UPDATE … WHERE status='pending'` atomique,
  « Déjà confirmée le … ». Noindex, `referrer: no-referrer`.
- Admin : `/admin/reservations` (liste minimale + « Renvoyer les mails »), étoffée à l'étape 5.
- Variables : `SITE_URL`, `SMTP_HOST/PORT/USER/PASSWORD/FROM`, `MAIL_TO_RESTAURANT`.
- EmailJS et l'ancienne page `/reservation-autoreply` supprimés.

## Gestion des réservations (étape 5)
- `/admin/reservations?vue=a-traiter|aujourdhui|a-venir|passees&statut=…` (défaut : aujourd'hui, en attente + confirmées) ;
  `/admin/reservations/nouvelle` (téléphone → confirmée, email facultatif, langue du mail).
- Actions (`app/admin/(panel)/reservations/actions.ts`) : valider/refuser, annuler, modifier (date, heure,
  couverts, notes), renvoyer les mails ; case « prévenir le client » (mails `cancelled` / `modified` / `confirmed`).
  Les modifications de l'équipe ne sont PAS bloquées par horaires/congés/jours complets (exceptions possibles).
- Transitions gardées en SQL (`WHERE status IN (...)`) dans `lib/reservations/service.ts`.

## Accessibilité, SEO, RGPD (étape 6)
- Gabarit public `components/SiteShell.tsx` (lien d'évitement, `<main id="contenu">`) ; `MotionConfig reducedMotion="user"`
  (`components/Providers.tsx`) ; focus visible global (`globals.css`). Un seul h1 par page (accueil : « L'ATELIER DE L'ÉCHARPE »).
- Popup Happy hour = Radix Dialog (focus piégé, Échap, ne revient pas dans la session) ; formules = bouton `aria-expanded` ;
  infobulles de paiement remplacées par du texte ; contrastes corrigés (titre contact en rouge, formules en bleu foncé).
- Audit : axe-core (WCAG 2.2 AA + best-practice) sur toutes les pages publiques/admin, desktop + mobile, états ouverts → 0 violation.
  Le relancer après tout changement d'UI (script jetable : injecter `axe.min.js` via Playwright).
- SEO : métadonnées par page (titre via `template`, canonical, description), JSON-LD `Restaurant` (horaires lus en base) sur l'accueil,
  sitemap + robots (`/admin`, `/api/`, `/r/` exclus).
- RGPD : `/mentions-legales` (champs dans `lib/legal.ts`, à compléter), `/confidentialite`, mention dans le formulaire (4 langues),
  purge quotidienne (`lib/reservations/purge.ts`, route `/api/cron/purge`, `vercel.json`, secret `CRON_SECRET`) :
  réservations > 12 mois (après leur date), sessions/vérifications expirées, compteurs de rate limit.
- À FAIRE avant la mise en ligne : renseigner `LEGAL.legalForm`, `LEGAL.siret`, `LEGAL.publisher` (mentions légales) ;
  relire la politique de confidentialité avec la cliente ; choisir la région Neon (UE recommandée).

## Base de données (dev)
- `db/schema.ts` (Drizzle), migrations SQL versionnées dans `drizzle/` (`npm run db:generate` après
  chaque changement de schéma, à committer).
- `db/connect.ts` : Neon si `DATABASE_URL`, sinon PGlite (`.data/pglite`, migré automatiquement, refusé
  en production). `db/index.ts` = point d'entrée `server-only` ; `lib/data.ts` = lectures publiques.
- `npm run db:migrate` (Neon ou PGlite), `db:seed` (depuis `db/seed-data.json`, refuse une base non vide ;
  `--force` requis sur Neon), `db:reset` (PGlite uniquement). Arrêter `next dev` avant ces commandes
  (PGlite = un seul processus à la fois).
- `db/seed-data.json` contient des valeurs d'exemple : y mettre les vraies horaires/formules.

## Commandes
- `npm run dev` / `npm run build` / `npm run lint` (ESLint 9 flat config ; dette lint préexistante).

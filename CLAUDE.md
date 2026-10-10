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
1. **Mise à jour Next 16 / React 19** — patch appliqué (branche `chore/upgrade-next`) ; vérification
   visuelle (animations Framer Motion v14, datepicker v9, menu mobile) à finir, puis PR.
   Note : `next.config.js` désactive `agentRules` (pas d'AGENTS.md généré).
2. **Données** — schéma Drizzle : opening_hours, holidays, closed_days, formules, menu_files,
   reservations, tables Better Auth. `reservations` : id, status (pending|confirmed|refused|cancelled),
   type (table|group), date, time, covers, name, email, phone, notes, formules (jsonb), locale,
   token (aléatoire, unique), mail_status, created_at, updated_at, decided_at.
   PGlite en dev / Neon en prod, script de seed. Lectures du site public en Server Components
   (fin des « Chargement… »).
3. **Back-office (parité)** — Better Auth, /admin protégé (proxy + vérif serveur), upload PDF sur
   Vercel Blob, horaires + congés + formules + jours complets. Mobile-first, accessible, en français.
4. **Réservation** — Server Action + Zod + honeypot. Enregistrer d'abord (pending), puis mails
   (restaurant + accusé) ; un échec de mail ne perd jamais la réservation (mail_status + bouton
   « renvoyer »). Le mail lie `/r/[token]` (aucune donnée perso dans l'URL) avec VALIDER / REFUSER
   par bouton POST / Server Action, **jamais** par lien GET (scanners antivirus). Idempotence :
   « Déjà confirmée le … ». 4 langues (FR, EN, ES, IT) et textes de mails existants.
   URL de base via variable d'env (plus de `latelier-de-lecharpe.vercel.app` en dur).
5. **Gestion des réservations (admin)** — « Aujourd'hui / À venir », filtre statut, annuler, modifier,
   ajout manuel (téléphone → confirmée, email facultatif), case « prévenir le client ».
6. **Accessibilité, SEO, RGPD** — passe RGAA (h1 découpé en h1/h2/h3 sur l'accueil, sélecteur de langue
   en emoji sans libellé ni `lang`, formulaires, focus, contrastes), purge des réservations > 12 mois,
   mentions RGPD.
7. **Bascule** — variables de prod Vercel, migration Neon, import des données, SMTP IONOS, recette,
   TTL DNS abaissé puis bascule chez IONOS (noter les MX existants avant).

## Commandes
- `npm run dev` / `npm run build` / `npm run lint` (ESLint 9 flat config ; dette lint préexistante).

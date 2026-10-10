# Mise en production

Guide de bascule du site vers l'hébergement de la cliente (Vercel + Neon + Vercel Blob + messagerie IONOS).
Les étapes qui demandent un compte (Vercel, IONOS…) se font avec les identifiants **de la cliente**.

## 0. Avant de commencer

- [ ] Comptes ouverts **au nom de la cliente** : Vercel, GitHub (le dépôt peut rester chez le développeur, ou être transféré), IONOS (déjà existant : domaine + messagerie).
- [ ] Vercel : l'offre gratuite (Hobby) est réservée à un usage personnel non commercial ; un restaurant relève de l'offre **Pro**. À vérifier dans les conditions de Vercel.
- [ ] Renseigner `lib/legal.ts` : forme juridique, SIRET, directeur de la publication (mentions légales obligatoires).
- [ ] Mettre les vraies horaires et formules dans `db/seed-data.json` (ou les saisir ensuite dans l'admin).
- [ ] **Noter les enregistrements DNS actuels** (surtout les `MX`, mais aussi `TXT`/SPF, `CNAME`) : capture d'écran de la zone DNS chez IONOS, ou `dig +noall +answer ANY latelierdelecharpe.fr`.

## 1. Projet Vercel

1. Vercel → *Add New… → Project* → importer le dépôt GitHub. Branche de production : `main`.
2. *Storage* → **Neon** (intégration Marketplace) → créer la base, **région UE (Francfurt)**. La variable `DATABASE_URL` est injectée automatiquement.
3. *Storage* → **Blob** → créer le store (accès public). La variable `BLOB_READ_WRITE_TOKEN` est injectée.
4. *Settings → Environment Variables* (environnement **Production**) :

| Variable | Valeur |
|---|---|
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | `https://www.latelierdelecharpe.fr` |
| `SITE_URL` | `https://www.latelierdelecharpe.fr` |
| `SMTP_HOST` | `smtp.ionos.fr` (à confirmer dans l'espace IONOS) |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `reservations@latelierdelecharpe.fr` |
| `SMTP_PASSWORD` | mot de passe de la boîte |
| `SMTP_FROM` | facultatif, ex. `"L'Atelier de l'Écharpe" <reservations@latelierdelecharpe.fr>` |
| `MAIL_TO_RESTAURANT` | boîte qui reçoit les demandes |
| `CRON_SECRET` | `openssl rand -base64 32` (Vercel l'envoie à la tâche de purge) |

   Tant que le domaine n'est pas basculé, mettre l'URL `…vercel.app` dans `BETTER_AUTH_URL` et `SITE_URL`, puis la remplacer au moment de la bascule.
5. Déployer. Le script `vercel-build` **bloque** un déploiement de production s'il manque une variable (liste affichée dans les logs), puis applique les migrations de base (`drizzle/`) avant de construire le site.

## 2. Compte administrateur et données

```bash
npm i -g vercel && vercel link            # une fois, dans le dépôt
vercel env pull .env.local --environment=production
npm run admin:create -- prenom@exemple.fr "Prénom Nom"   # mot de passe demandé (12 caractères minimum)
npm run db:seed -- --force                # horaires, formules… depuis db/seed-data.json (refuse une base non vide)
rm .env.local                             # ne pas laisser les secrets de production sur le poste
```

- Le même `admin:create` réinitialise le mot de passe si le compte existe (il n'y a pas de « mot de passe oublié » par mail).
- Les cartes (PDF/images) s'ajoutent ensuite dans `/admin/cartes`.
- Se connecter sur `/admin/login` et vérifier chaque section.

## 3. Messagerie (IONOS)

- [ ] Boîte `reservations@latelierdelecharpe.fr` créée dans IONOS (Emails & Office).
- [ ] Faire une réservation de test sur le site déployé : le restaurant reçoit le mail (avec le bouton « Traiter la demande »), le client reçoit l'accusé.
- [ ] Vérifier que les mails n'arrivent pas en spam. Si le domaine est géré chez IONOS, SPF/DKIM sont en général déjà configurés ; sinon, les ajouter dans la zone DNS.
- [ ] Si un mail échoue : la réservation est conservée, `/admin/reservations` affiche « Échec de l'envoi » et propose **Renvoyer les mails**.

## 4. Recette avec la cliente

- [ ] Accueil, dîner, fiesta, contact : textes, horaires, formules, cartes.
- [ ] Réservation de table, puis de groupe avec formule ; en français et dans une autre langue.
- [ ] Mail reçu → ouvrir le lien → **Valider** → le client reçoit la confirmation ; rouvrir le lien : « Déjà confirmée le… ».
- [ ] Admin : ajouter une réservation par téléphone, modifier, annuler (avec et sans prévenir le client).
- [ ] Admin : changer un horaire, ajouter un congé et un jour complet → visibles dans le calendrier du formulaire.
- [ ] Mobile (téléphone de la cliente) : site et admin.
- [ ] Mentions légales et politique de confidentialité relues et validées.

## 5. Bascule du domaine (chez IONOS)

**48 h avant** : abaisser le TTL des enregistrements `A` et `CNAME www` à **300 s** (5 min).

**Jour J** (hors service, par ex. en matinée) :

1. Vercel → *Settings → Domains* → ajouter `latelierdelecharpe.fr` et `www.latelierdelecharpe.fr` (`www` = domaine principal, l'apex redirige vers `www`). Vercel affiche les valeurs DNS exactes à utiliser (en général : `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`).
2. Chez IONOS, **modifier uniquement** l'enregistrement `A` de l'apex et le `CNAME`/`A` de `www`. **Ne pas toucher** aux `MX`, ni aux `TXT` (SPF, DKIM, vérifications) : la messagerie doit continuer à fonctionner.
3. Remplacer `BETTER_AUTH_URL` et `SITE_URL` par `https://www.latelierdelecharpe.fr`, puis **Redeploy**.
4. Attendre le certificat HTTPS (quelques minutes) et vérifier : `https://www.latelierdelecharpe.fr`, `/reservation`, `/admin/login`, `/sitemap.xml`.
5. Refaire une réservation de test de bout en bout et vérifier qu'un mail **entrant** arrive toujours sur la boîte du restaurant.

**Retour arrière** : remettre les anciens enregistrements `A`/`CNAME` (noter les valeurs avant) ; avec un TTL de 5 min, l'ancien site revient en quelques minutes.

**Ensuite** : remonter le TTL à sa valeur habituelle (1 h ou plus).

## 6. Après la bascule

- [ ] Soumettre `https://www.latelierdelecharpe.fr/sitemap.xml` à Google Search Console (si utilisé).
- [ ] Après quelques semaines sans incident : supprimer l'ancien projet Supabase et fermer le compte EmailJS de l'ancien prestataire.
- [ ] Faire changer les mots de passe et accès restés chez l'ancien prestataire (domaine, IONOS, Instagram…).
- [ ] Neon : vérifier la rétention des sauvegardes (point-in-time restore) de l'offre choisie.

## Exploitation courante

| Besoin | Commande ou lieu |
|---|---|
| Voir les erreurs | Vercel → *Logs* |
| Mails non partis | `/admin/reservations` → *Renvoyer les mails* |
| Nouveau compte admin / mot de passe perdu | `vercel env pull` puis `npm run admin:create -- email "Nom"` |
| Changer le schéma de base | modifier `db/schema.ts`, `npm run db:generate`, committer `drizzle/` ; appliqué au déploiement |
| Purge des données de plus de 12 mois | automatique chaque nuit (`/api/cron/purge`) |

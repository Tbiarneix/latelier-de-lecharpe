# L'Atelier de l'Écharpe

Site du restaurant L'Atelier de l'Écharpe (Toulouse) : vitrine, cartes, réservation en ligne et espace d'administration.

**Stack** : Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 3 · Framer Motion · Drizzle ORM · Postgres (Neon en production, PGlite en local) · Better Auth · Vercel Blob · Nodemailer (SMTP IONOS).

## Démarrage

```bash
npm install
cp .env.example .env.local        # les valeurs vides conviennent en local
npm run db:migrate && npm run db:seed
BETTER_AUTH_SECRET=dev-secret-dev-secret-dev-secret-0123 \
  npm run admin:create -- moi@exemple.fr "Mon Nom"   # crée un compte admin (mot de passe demandé)
npm run dev                       # http://localhost:3000 — admin : /admin
```

En local, sans configuration :
- la base est **PGlite** (`.data/pglite`, ignoré par git) ;
- les cartes envoyées sont écrites dans `public/uploads` ;
- les **mails s'affichent dans la console** (lien `/r/<jeton>` inclus).

Définir `BETTER_AUTH_SECRET` dans `.env.local` pour que l'authentification fonctionne.

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run db:generate` | génère une migration SQL après modification de `db/schema.ts` |
| `npm run db:migrate` | applique les migrations (Neon si `DATABASE_URL`, sinon PGlite) |
| `npm run db:seed` | importe `db/seed-data.json` (refuse une base non vide ; `--force` requis sur Neon) |
| `npm run db:reset` | supprime la base locale PGlite |
| `npm run admin:create -- email "Nom"` | crée un administrateur ou réinitialise son mot de passe |
| `npm run check:env` | vérifie les variables de production (bloque le déploiement si incomplètes) |
| `npm run lint` | ESLint |

Arrêter `next dev` avant les commandes `db:*` : PGlite n'accepte qu'un processus à la fois.

## Organisation

```
app/                 pages (public, /admin, /r/[token], /api)
components/          composants (public, admin/, reservation/, menu/)
db/                  schéma Drizzle, connexion, données initiales
drizzle/             migrations SQL versionnées
lib/                 accès aux données, auth, mails, règles de réservation
scripts/             migration, seed, création d'admin, vérification d'environnement
docs/                guide de mise en production
```

Le contexte du projet, les décisions d'architecture et l'état d'avancement sont dans [`CLAUDE.md`](CLAUDE.md).
La mise en production (Vercel, Neon, IONOS, bascule DNS) est décrite dans [`docs/mise-en-production.md`](docs/mise-en-production.md).

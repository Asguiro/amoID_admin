# AMO ID Santé — Web Admin

Back-office institutionnel CANAM / AMO ID Santé Mali : supervision, audit, reporting et traitement des alertes.

## Stack

- React Router 8 Framework Mode (SSR)
- TypeScript strict
- Tailwind CSS 4 + daisyUI (thème `amo-admin`)
- Session cookie signée `httpOnly`
- Couches `app/services` (métier) et `app/server` (adapters SSR)

## Démarrage

```bash
cp .env.example .env
npm install
npm run dev
```

Application : `http://localhost:5173`

### Compte démo

| E-mail | Mot de passe | Rôle |
|---|---|---|
| `admin@amo.ml` | `Admin123!` | ADMIN_NATIONAL |
| `superviseur@amo.ml` | `Super123!` | SUPERVISEUR_REGIONAL |

## Architecture

```txt
route (loader/action)
  → app/server/*     guards, session, client API, orchestration
  → app/services/*   traitements métier
  → API NestJS / mocks
```

Règles :

- jamais de token API dans le navigateur ;
- filtres / période / pagination dans les **search params** (SSR via URL) ;
- loading visible (`PendingOutlet` + skeletons) sur tout chargement de data ;
- `ErrorBoundary` par route data — pas d’écran blanc.

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run start` | Servir le build |
| `npm run typecheck` | Types |
| `npm test` | Tests unitaires (Vitest) |
| `npm run test:e2e` | Tests E2E (Playwright) |
| `npm run check` | typecheck + unit + e2e |

## Variables d'environnement

Voir `.env.example` :

- `API_URL` — base URL API (server-only)
- `SESSION_SECRET` — secret cookie session
- `APP_ENV` — `development` \| `test` \| `production`

Ne pas exposer de secrets via `VITE_*`.

## Documentation

Le cadrage produit et technique est dans `docs/`. Les règles Cursor sont dans `.cursor/`.

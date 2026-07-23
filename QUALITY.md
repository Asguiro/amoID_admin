# Qualité AMOID — notes tooling

## Prisma (API) — rester en v6

L’API utilise **Prisma 6.19** (`prisma` / `@prisma/client` dans `amo-id_api/package.json`).

Dans `prisma/schema.prisma`, `url` / `directUrl` dans le bloc `datasource` sont **corrects** pour Prisma 6.

Si l’IDE affiche :

> The datasource property `url` is no longer supported… Move to prisma.config.ts…

c’est un diagnostic **Prisma 7** (extension Language Server trop récente). **Ne pas** retirer `url` du schema ni migrer vers Prisma 7 sans chantier dédié (adapters, déploiement Render, migrations).

`prisma.config.ts` sert déjà au seed / chemin migrations sous Prisma 6.

## TypeScript `baseUrl`

`baseUrl` a été retiré de `amo-id_api/tsconfig.json` (non utilisé, déprécié sous TS 6→7).

## Admin — warning `envFile`

Le message `The envFile option is deprecated, please use envDir: false` pendant `npm run typecheck` vient de `@react-router/dev@8.0.0` (appel interne Vite), pas d’une option locale. Corriger via upgrade contrôlé de React Router, pas un hack local.

## Scripts `check`

| Projet | Commande |
|--------|----------|
| API | `npm run check` → lint + `nest build` |
| Mobile | `npm run check` → lint (`--max-warnings 0`) + `tsc` |
| Admin | `npm run check` → typecheck + tests + e2e |

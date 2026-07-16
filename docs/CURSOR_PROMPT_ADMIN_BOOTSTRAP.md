# Prompt Cursor — Bootstrap AMO ID Admin

Copier ce prompt dans Cursor à la racine du repo web.

```txt
Tu travailles sur le back-office AMO ID Santé Mali.

Avant de coder, lis dans cet ordre :
1. AGENTS.md si présent.
2. docs/00_ADMIN_VISION_SCOPE.md
3. docs/01_ADMIN_INFORMATION_ARCHITECTURE.md
4. docs/02_ADMIN_PAGES_AND_ROUTES.md
5. docs/03_ADMIN_RBAC_MATRIX.md
6. docs/05_ADMIN_DESIGN_SYSTEM_DAISYUI.md
7. .cursor/rules/*

Objectif immédiat : mettre en place les fondations du web admin, sans implémenter tous les modules en même temps.

Stack obligatoire :
- React Router v7 Framework Mode avec SSR activé ;
- TypeScript strict ;
- Tailwind CSS 4 ;
- daisyUI avec thème AMO personnalisé ;
- Zod ;
- Lucide React ;
- loaders/actions pour les données et mutations ;
- API server-only ;
- cookie de session signé httpOnly ;
- aucune donnée serveur métier dans un store client global.

Architecture obligatoire :
- app/routes.ts centralise les routes ;
- app/router/* peut regrouper les routes par domaine ;
- pages dans app/pages/<domain>/ ;
- logique serveur dans app/server/<domain>/{loaders,actions,schema,mappers}/ ;
- appels API dans app/server/api/*.server.ts ;
- composants partagés dans app/components ;
- filtres, tri et pagination dans les search params.

Travail demandé maintenant :
1. Audite la structure existante et liste les écarts.
2. Propose un plan de fichiers précis.
3. Configure SSR, Tailwind CSS 4 et daisyUI sans casser le scaffold React Router.
4. Crée le thème amo-admin à partir des tokens documentés.
5. Crée AdminShell, Sidebar, Topbar, PageHeader et les états Loading/Empty/Error.
6. Crée la session server-only, requireAuth et requirePermission.
7. Crée l'API client server-only avec erreurs typées et correlationId.
8. Crée les routes /login, /dashboard, /unauthorized et la page 404.
9. Implémente un dashboard avec données mockées derrière app/server/api, jamais directement dans la page.
10. Ajoute tests unitaires et E2E minimum pour auth, permission et responsive.

Règles de sécurité :
- aucun token dans localStorage, sessionStorage, React Context ou HTML ;
- aucun accès basé uniquement sur un menu masqué ;
- aucune donnée biométrique ou médicale en clair ;
- pas de suppression définitive ;
- les actions sensibles demanderont motif et audit dans les phases suivantes.

Règles design :
- fond #F5F7FB, cartes blanches, titres #0B1B33, primaire #0E5B3B ;
- design institutionnel AMO, pas de template SaaS générique ;
- responsive desktop/tablette/mobile ;
- composants réutilisables, pas de styles ad hoc par page.

Procède étape par étape. Avant chaque groupe de modifications, explique les fichiers qui vont changer. Après chaque étape, lance typecheck et build, puis corrige toutes les erreurs.
```

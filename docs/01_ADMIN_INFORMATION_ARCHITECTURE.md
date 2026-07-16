# 01 — Architecture de l'information et architecture code

## 1. Navigation principale

```txt
Vue d'ensemble
Bénéficiaires
Enrôlements
Vérifications
Agents
Établissements
Appareils
QR temporaires
Alertes & fraude
Rapports
Audit
Paramètres
```

Le menu est généré à partir d'une configuration unique et filtré par permission. Une route interdite doit répondre `403` même si elle n'est pas affichée.

## 2. Structure React Router v7 SSR

```txt
app/
  root.tsx
  routes.ts
  router/
    auth.routes.ts
    dashboard.routes.ts
    beneficiaries.routes.ts
    enrollments.routes.ts
    verifications.routes.ts
    agents.routes.ts
    establishments.routes.ts
    devices.routes.ts
    temporary-qr.routes.ts
    alerts.routes.ts
    reports.routes.ts
    audit.routes.ts
    settings.routes.ts

  pages/
    auth/
    dashboard/
    beneficiaries/
    enrollments/
    verifications/
    agents/
    establishments/
    devices/
    temporary-qr/
    alerts/
    reports/
    audit/
    settings/
    errors/

  components/
    layouts/
      AdminShell.tsx
      Sidebar.tsx
      Topbar.tsx
      PageHeader.tsx
    ui/
      AppCard.tsx
      AppButton.tsx
      StatusBadge.tsx
      EmptyState.tsx
      ErrorState.tsx
      LoadingState.tsx
      ConfirmDialog.tsx
    data-table/
      DataTable.tsx
      DataTableToolbar.tsx
      DataTablePagination.tsx
      DataTableColumnHeader.tsx
    dashboard/
    charts/
    beneficiaries/
    agents/
    alerts/
    reports/

  server/
    auth/
      session.server.ts
      require-auth.server.ts
      require-permission.server.ts
      csrf.server.ts
    api/
      api-client.server.ts
      api-errors.server.ts
      auth-api.server.ts
      dashboard-api.server.ts
      beneficiaries-api.server.ts
      agents-api.server.ts
      establishments-api.server.ts
      devices-api.server.ts
      enrollments-api.server.ts
      verifications-api.server.ts
      temporary-qr-api.server.ts
      alerts-api.server.ts
      reports-api.server.ts
      audit-api.server.ts
      settings-api.server.ts
    <domain>/
      loaders/
        <domain>.server.ts
      actions/
        <domain>.server.ts
      schema/
        <domain>.schema.ts
      mappers/
        <domain>.mapper.ts

  config/
    navigation.ts
    permissions.ts
    feature-flags.ts
  types/
  utils/
  i18n/
    fr.ts
  styles/
    app.css
```

## 3. Règle de séparation

Une page React peut :

- composer l'interface ;
- lire `loaderData` et `actionData` ;
- utiliser `Form`, `useFetcher`, `useNavigation`, `useSearchParams` ;
- afficher les états pending, empty, error et success.

Une page React ne doit pas :

- lire ou écrire un token ;
- appeler directement l'API NestJS ;
- décider seule des permissions ;
- contenir un gros parsing de `FormData` ;
- calculer des indicateurs financiers métier ;
- reconstruire un composant déjà présent dans le design system.

## 4. Flux SSR

```txt
Navigateur
  -> route module React Router
  -> loader/action server-only
  -> requireAuth / requirePermission
  -> API client server-only
  -> API NestJS
  -> réponse typée et filtrée
  -> rendu SSR / revalidation
```

## 5. Gestion d'état

- Données serveur : loaders/actions et URL search params.
- Mutations partielles : `useFetcher` avec `intent` explicite.
- Filtres, pagination, tri : URL, pas état local opaque.
- État purement visuel : React local state.
- Pas de cache client global par défaut.

## 6. Pagination et tableaux

Tous les grands tableaux utilisent une pagination serveur. Les paramètres standards :

```txt
page
pageSize
sort
q
status
from
to
regionId
establishmentId
agentId
```

La sélection multiple ne doit être proposée que si une action groupée sûre existe. Aucune suppression groupée de bénéficiaires, logs ou événements.

## 7. Stratégie mock avant API

Les mocks sont isolés derrière les mêmes interfaces que l'API réelle :

```txt
app/server/api/*.server.ts
app/server/mocks/*.server.ts
```

Un feature flag server-only choisit mock ou API. Les pages ne connaissent pas l'implémentation.

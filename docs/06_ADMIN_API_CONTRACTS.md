# 06 — Contrats API attendus par le Web Admin

## 1. Convention de réponse paginée

```ts
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  generatedAt: string;
}
```

## 2. Convention d'erreur

```ts
export interface ApiErrorPayload {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  correlationId: string;
}
```

Le web affiche un message utilisateur français et conserve `correlationId` pour le support. Il n'affiche pas de stack trace.

## 3. Endpoints par domaine

### Dashboard

```txt
GET /admin/dashboard/summary
GET /admin/dashboard/trends
GET /admin/dashboard/alerts
```

### Bénéficiaires

```txt
GET /admin/beneficiaries
GET /admin/beneficiaries/:id
GET /admin/beneficiaries/:id/activity
GET /admin/beneficiaries/:id/coverage
GET /admin/beneficiaries/:id/costs        phase financière
```

### Enrôlements

```txt
GET  /admin/enrollments
GET  /admin/enrollments/:id
POST /admin/enrollments/:id/validate
POST /admin/enrollments/:id/return-for-correction
POST /admin/enrollments/:id/request-manual-review
```

### Agents

```txt
GET   /admin/agents
POST  /admin/agents
GET   /admin/agents/:id
PATCH /admin/agents/:id
POST  /admin/agents/:id/suspend
POST  /admin/agents/:id/reactivate
GET   /admin/agents/:id/activity
```

### Établissements

```txt
GET   /admin/establishments
POST  /admin/establishments
GET   /admin/establishments/:id
PATCH /admin/establishments/:id
POST  /admin/establishments/:id/suspend
POST  /admin/establishments/:id/reactivate
```

### Appareils

```txt
GET  /admin/devices
GET  /admin/devices/:id
POST /admin/devices/:id/revoke
POST /admin/devices/:id/restore           seulement si règle validée
```

### Vérifications

```txt
GET /admin/verifications
GET /admin/verifications/:id
```

### QR temporaires

```txt
GET  /admin/temporary-qr
GET  /admin/temporary-qr/:id
POST /admin/temporary-qr/:id/revoke
```

### Alertes

```txt
GET  /admin/alerts
GET  /admin/alerts/:id
POST /admin/alerts/:id/assign
POST /admin/alerts/:id/change-status
POST /admin/alerts/:id/comment
```

### Rapports

```txt
POST /admin/reports/exports
GET  /admin/reports/exports/:id
GET  /admin/reports/exports/:id/download
```

### Audit et paramètres

```txt
GET   /admin/audit-logs
GET   /admin/audit-logs/:id
GET   /admin/settings
PATCH /admin/settings/:key
```

## 4. Paramètres de liste

```txt
?page=1
&pageSize=25
&sort=-createdAt
&q=...
&status=...
&from=2026-07-01
&to=2026-07-31
&regionId=...
&establishmentId=...
&agentId=...
```

Le backend doit appliquer le scope du rôle indépendamment des filtres demandés.

## 5. Idempotence et concurrence

Pour les actions critiques :

- envoyer une clé d'idempotence ;
- gérer `409 Conflict` quand l'état a changé ;
- afficher un message puis revalider les données ;
- ne jamais écraser silencieusement une modification concurrente.

## 6. Audit

Toute mutation admin produit un événement d'audit côté backend. Le frontend ne construit pas lui-même la preuve d'audit ; il peut seulement envoyer un motif et un contexte.

## 7. Exports

Le frontend envoie les filtres et le type de rapport. Le backend :

- vérifie les permissions ;
- génère le fichier ;
- masque les données ;
- fournit un lien temporaire ;
- journalise le téléchargement.

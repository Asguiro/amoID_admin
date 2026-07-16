---
name: react-router-ssr-page-builder
description: Créer une page React Router v7 SSR avec route, loader, action et gestion des erreurs.
---

# Procédure

1. Déclarer la route dans `app/routes.ts` ou un fichier de domaine.
2. Créer `app/pages/<domain>/<Name>Page.tsx`.
3. Créer loader/action dans `app/server/<domain>/`.
4. Importer l'API server-only.
5. Appliquer `requireAuth` et `requirePermission`.
6. Parser search params avec Zod.
7. Déléguer depuis la page via exports courts.
8. Ajouter ErrorBoundary si le domaine nécessite un message spécifique.
9. Tester 200, 401/403, 422 et 500.

# Interdictions

Pas de fetch navigateur, pas de token client, pas de permission seulement visuelle.

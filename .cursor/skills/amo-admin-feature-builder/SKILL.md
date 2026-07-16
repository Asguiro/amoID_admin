---
name: amo-admin-feature-builder
description: Construire une feature complète du back-office AMO avec SSR, RBAC, UI, états et tests.
---

# Quand utiliser

Lorsqu'une nouvelle feature admin doit être ajoutée ou refactorisée.

# Workflow

1. Lire les docs produit, pages et RBAC.
2. Identifier routes, permissions, données, mutations et états.
3. Proposer l'arborescence des fichiers.
4. Créer schémas Zod et types.
5. Créer API server-only.
6. Créer loaders/actions avec guards.
7. Créer page et composants réutilisables.
8. Ajouter loading/empty/error/success.
9. Ajouter tests unitaires et E2E.
10. Lancer typecheck, tests et build.

# Sortie attendue

- résumé des décisions ;
- liste des fichiers modifiés ;
- risques et points ouverts ;
- résultats des commandes de vérification.

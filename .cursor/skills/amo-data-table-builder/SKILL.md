---
name: amo-data-table-builder
description: Construire une table admin accessible avec TanStack Table et opérations serveur.
---

# Workflow

1. Définir colonnes et permissions.
2. Définir search params Zod.
3. Charger une page de données côté serveur.
4. Configurer TanStack Table en manualPagination/manualSorting/manualFiltering.
5. Synchroniser tri, filtres et page avec l'URL.
6. Ajouter actions ligne sécurisées.
7. Ajouter skeleton, empty, error.
8. Tester clavier, responsive et gros volumes.

# Règles

Ne pas charger toutes les lignes. Ne pas afficher d'identifiant sensible complet. Ne pas virtualiser sans mesure.

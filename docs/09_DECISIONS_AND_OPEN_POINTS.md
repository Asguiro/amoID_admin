# 09 — Décisions et points à confirmer

## Décisions proposées

1. Nom du repo : `amoID_admin`.
2. React Router v7 Framework Mode, SSR activé.
3. Session serveur dans cookie signé `httpOnly`.
4. DaisyUI comme seule bibliothèque de composants.
5. Tailwind CSS 4 via `@tailwindcss/vite`.
6. TanStack Table pour les tables avec pagination serveur.
7. Apache ECharts pour les graphiques.
8. Zod pour validation.
9. Lucide React pour les icônes.
10. Pas de hard delete pour agents, établissements, bénéficiaires, QR ou logs.
11. Les exports officiels sont générés côté backend.
12. Le module coûts reste désactivé tant que les prestations ne sont pas connectées.

## Points métier à confirmer

- Le superviseur régional peut-il suspendre un agent ?
- Le superviseur régional peut-il valider un nouvel agent ?
- Le superviseur d'établissement peut-il créer un agent ou uniquement le gérer ?
- Quels rôles peuvent révoquer un QR temporaire ?
- Un appareil révoqué peut-il être restauré ou doit-il être réenrôlé ?
- Qui peut consulter les données médicales facultatives ?
- Qui peut accéder aux coûts nominatifs par bénéficiaire ?
- L'auditeur peut-il seulement signaler ou aussi changer le statut d'une alerte ?
- Faut-il créer un rôle `ANALYSTE_FRAUDE` distinct ?
- Quelles durées de conservation s'appliquent aux logs, rapports et exports ?

## Points données / intégrations

- Source des droits AMO ;
- source des prestations et remboursements ;
- fréquence de synchronisation ;
- identifiant pivot entre bénéficiaire, prestation et établissement ;
- qualité historique des montants ;
- liste officielle des codes de prestation ;
- règles de géolocalisation et horaires ;
- disponibilité d'une cartographie des établissements.

## Incohérence à résoudre avant implémentation auth

Des documents de référence antérieurs peuvent mentionner un token en mémoire sans cookie, tandis que l'architecture SSR la plus sécurisée et la documentation web indiquent une session cookie `httpOnly`. Pour ce nouveau back-office, la décision recommandée est la session serveur `httpOnly`; elle doit être confirmée comme source de vérité unique.

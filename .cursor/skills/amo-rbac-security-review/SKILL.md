---
name: amo-rbac-security-review
description: Revoir une feature pour vérifier session SSR, permissions, données sensibles et audit.
---

# Revue

- session httpOnly ;
- absence de token navigateur ;
- permission loader/action ;
- permission API ;
- scope région/site ;
- masquage des identifiants ;
- motif des actions sensibles ;
- audit backend ;
- absence de hard delete ;
- gestion 401/403/409/422 ;
- export protégé.

# Sortie

Fournir les vulnérabilités avec sévérité, scénario, fichier et correction.

# 08 — Checklist UX, qualité et sécurité

## Clarté

- [ ] L'utilisateur comprend la page en moins de 5 secondes.
- [ ] Le titre, la période et le périmètre sont visibles.
- [ ] L'action principale est évidente.
- [ ] Les statuts sont exprimés en français métier.
- [ ] Aucun score biométrique brut dans les listes.

## Données

- [ ] Loading, empty, error et success sont gérés.
- [ ] Les filtres et la pagination sont dans l'URL.
- [ ] Les données affichées correspondent au scope du rôle.
- [ ] Les identifiants sensibles sont masqués.
- [ ] La source et l'heure de génération des indicateurs sont visibles.

## Actions

- [ ] Les mutations utilisent une `action` server-only.
- [ ] Les actions sensibles demandent confirmation et motif.
- [ ] Un double clic ne crée pas deux mutations.
- [ ] Un conflit `409` est géré proprement.
- [ ] Une action réussie revalide les données.

## Sécurité

- [ ] Aucun token dans `localStorage` ou dans le composant.
- [ ] Le loader/action vérifie la permission.
- [ ] Le backend reste la décision finale.
- [ ] Aucune photo brute ou donnée médicale dans les logs UI.
- [ ] Les exports appliquent masquage et permissions.
- [ ] La consultation sensible est auditée.

## Design

- [ ] Palette AMO uniquement.
- [ ] Maximum deux couleurs fortes par zone.
- [ ] Ombres légères.
- [ ] Même composant pour les mêmes patterns.
- [ ] Pas de template SaaS générique violet/bleu.
- [ ] Table lisible et non surchargée.

## Accessibilité

- [ ] Navigation clavier complète.
- [ ] Focus visible.
- [ ] Labels associés aux champs.
- [ ] Contraste AA.
- [ ] Les statuts ne reposent pas uniquement sur la couleur.
- [ ] Les graphiques ont un résumé textuel.
- [ ] Les modales restaurent le focus.

## Tests

- [ ] Test loader autorisé.
- [ ] Test loader interdit.
- [ ] Test action valide.
- [ ] Test action invalide.
- [ ] Test erreurs API.
- [ ] Test E2E du parcours principal.
- [ ] Test axe sur la page.
- [ ] Snapshot visuel sur au moins desktop et tablette.

# 07 — Roadmap d'implémentation

## Phase 0 — Fondations

- créer le repo `amoID_admin` ;
- activer SSR ;
- intégrer Tailwind CSS 4 + daisyUI ;
- créer le thème AMO ;
- installer tests ;
- mettre en place `.cursor/rules` et `.cursor/skills` ;
- créer session cookie `httpOnly` ;
- créer API client server-only ;
- créer `AdminShell`, Sidebar, Topbar, PageHeader ;
- mettre en place erreurs 401/403/404/500.

Critère de sortie : login mock ou API, route protégée, layout responsive, typecheck et build verts.

## Phase 1 — Dashboard opérationnel

- KPIs ;
- tendances ;
- activité récente ;
- alertes prioritaires ;
- filtres de période ;
- états loading/empty/error ;
- données mockées derrière l'API server-only.

## Phase 2 — Agents, établissements et appareils

- liste agents ;
- création/modification ;
- suspension/réactivation ;
- liste établissements ;
- création/modification ;
- inventaire appareils ;
- révocation ;
- historique d'activité.

## Phase 3 — Bénéficiaires et enrôlements

- recherche ;
- détail protégé ;
- historique ;
- file de validation ;
- validation / renvoi correction ;
- affichage des doublons potentiels ;
- audit de chaque action.

## Phase 4 — Vérifications et QR temporaires

- historique vérifications ;
- détail ;
- suivi QR ;
- révocation ;
- usage et chronologie.

## Phase 5 — Audit, alertes et fraude

- journal global ;
- filtres avancés ;
- détail événement ;
- file alertes ;
- assignation ;
- investigation ;
- décisions et commentaires ;
- règles de signaux simples.

## Phase 6 — Reporting

- rapports opérationnels ;
- export CSV backend ;
- rapport biométrie ;
- rapport QR ;
- rapport alertes ;
- comparaison périodes.

## Phase 7 — Coûts AMO

Démarre uniquement après validation des sources de données financières.

- modèle de prestations ;
- imports ou connecteurs ;
- contrôle qualité ;
- agrégations ;
- top bénéficiaires ;
- coûts par établissement ;
- anomalies financières ;
- protection renforcée et rapports.

## Phase 8 — Durcissement

- tests E2E par rôle ;
- tests accessibilité ;
- tests visuels ;
- performance tables et graphiques ;
- sécurité session/CSRF ;
- revue des exports ;
- observabilité et correlation IDs ;
- plan de reprise et journalisation.

## Règle de livraison

Une phase ne doit pas être fusionnée si :

- les permissions ne sont pas testées ;
- les états empty/error/loading manquent ;
- un appel API se trouve dans un composant ;
- une action sensible n'a pas de confirmation/motif ;
- le responsive ou le clavier est cassé ;
- le typecheck ou le build échoue.

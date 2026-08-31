# 03 — Matrice RBAC

## 1. Rôles de référence

- `ADMIN_CENTRAL`
- `REGIONAL_SUPERVISOR`
- `ESTABLISHMENT_SUPERVISOR`
- `AUDITOR`
- `ENROLLMENT_AGENT`
- `CARE_POINT_AGENT`

`FRAUD_ANALYST` est une proposition d'évolution et ne doit pas être activé sans validation métier.

## 2. Permissions atomiques

```txt
dashboard.read.global
dashboard.read.region
dashboard.read.establishment
beneficiary.read.basic
beneficiary.read.sensitive
beneficiary.read.health
beneficiary.read.costs
enrollment.read
enrollment.validate
enrollment.return_for_correction
enrollment.reject
agent.read
agent.create
agent.update
agent.suspend
agent.reactivate
device.read
device.revoke
establishment.read
establishment.create
establishment.update
verification.read
qr.read
qr.revoke
alert.read
alert.assign
alert.investigate
alert.decide
report.read
report.export
audit.read
settings.read
settings.update
```

## 3. Matrice synthétique

| Capacité | Admin central | Superviseur régional | Superviseur établissement | Auditeur | Agent enrôlement | Agent point de soin |
|---|---:|---:|---:|---:|---:|---:|
| Dashboard global | Oui | Non | Non | Lecture contrôle | Non | Non |
| Dashboard région | Oui | Oui | Non | Lecture | Non | Non |
| Dashboard établissement | Oui | Région | Oui | Lecture | Limité | Limité |
| Bénéficiaire identité minimale | Oui | Région | Site | Selon mission | Dossiers autorisés | Vérification courante |
| Données sensibles | Permission explicite | Permission explicite | Non par défaut | Selon mandat | Selon enrôlement | Non par défaut |
| Coûts bénéficiaire | Permission explicite | Agrégé région | Agrégé site | Oui selon mandat | Non | Non |
| Valider enrôlement | Oui | Oui | À confirmer | Non | Non | Non |
| Renvoyer pour correction | Oui | Oui | À confirmer | Non | Non | Non |
| Rejeter enrôlement | Oui | Oui | À confirmer | Non | Non | Non |
| Demander revue manuelle | Oui (`enrollment.validate`) | Oui | À confirmer | Non | Non | Non |
| Lire résumé santé (fiche enrôlement) | Permission `beneficiary.read.health` | Idem | Non par défaut | Selon mandat | Non | Non |
| Créer agent | Oui | À confirmer | Site si autorisé | Non | Non | Non |
| Suspendre agent | Oui | À confirmer | Site | Non | Non | Non |
| Révoquer appareil | Oui | Région si autorisé | Site | Non | Non | Non |
| Révoquer QR | Oui | Région si autorisé | Site si autorisé | Non | Non | Non |
| Investiguer alerte | Oui | Région | Site | Lecture / signalement | Non | Non |
| Décider fraude confirmée | Oui | À confirmer | Non | Non | Non | Non |
| Lire audit | Oui | Région | Site | Oui | Activité personnelle | Activité personnelle limitée |
| Modifier paramètres | Oui | Non | Non | Non | Non | Non |

## 4. Implémentation

La permission est vérifiée à trois niveaux :

1. menu et boutons pour l'ergonomie ;
2. loader/action React Router pour empêcher l'accès direct ;
3. API NestJS pour la décision finale.

Exemple de loader :

```ts
export async function agentsListLoader(args: LoaderFunctionArgs) {
  const context = await requirePermission(args.request, 'agent.read');
  return getAgents({ context, filters: parseAgentFilters(args.request.url) });
}
```

### Enrôlements — règles UI (PR-7)

| Action UI | Permission API requise | Notes |
|---|---|---|
| Valider | `enrollment.validate` | — |
| Renvoyer pour correction | `enrollment.return_for_correction` | Motif obligatoire |
| Rejeter | `enrollment.reject` | Met `EnrollmentProgress` en `CORRECTION_REQUIRED` |
| Demander revue manuelle | `enrollment.validate` | Aligné API (`request-manual-review`) — **pas** `return_for_correction` seul |
| Afficher `healthSummary` | `beneficiary.read.health` | Masqué sinon |
| Bloc `EnrollmentProgress` | `enrollment.read` | Étape courante + flags sur fiche détail |

Navigation « À valider » : `/enrollments/pending` — badge alimenté par le compteur `PENDING_VALIDATION`.

## 5. Actions sensibles

Les actions suivantes exigent un motif :

- suspension / réactivation d'agent ;
- révocation d'appareil ;
- révocation de QR ;
- renvoi d'enrôlement ;
- accès exceptionnel à une donnée sensible ;
- changement de seuil ou règle globale ;
- décision finale sur une alerte.

## 6. Masquage

- listes : identifiants personnels partiellement masqués ;
- exports : pseudonymisation selon le rôle ;
- détail : révélation progressive, permission et journalisation ;
- URL : utiliser un identifiant opaque, jamais NINA ou numéro AMO brut.

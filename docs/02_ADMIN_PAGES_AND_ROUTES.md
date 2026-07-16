# 02 — Pages et routes du Web Admin

## 1. Authentification

| Route | Page | Accès | Fonction |
|---|---|---|---|
| `/login` | `LoginPage` | Public | Connexion professionnelle |
| `/logout` | action seule | Authentifié | Détruit la session SSR |
| `/unauthorized` | `ForbiddenPage` | Tous | Accès refusé |

## 2. Vue d'ensemble

| Route | Page | Fonction |
|---|---|---|
| `/dashboard` | `DashboardPage` | KPIs, tendances, alertes prioritaires, activité récente |

Sections du dashboard :

- enrôlements aujourd'hui / période ;
- vérifications réussies, douteuses et échouées ;
- taux de succès biométrique ;
- QR actifs, expirés, révoqués ;
- agents actifs et appareils révoqués ;
- alertes nouvelles et critiques ;
- établissements les plus actifs ;
- coût total et top bénéficiaires uniquement si données financières disponibles.

## 3. Bénéficiaires

| Route | Page | Fonction |
|---|---|---|
| `/beneficiaries` | `BeneficiariesListPage` | Recherche et filtres |
| `/beneficiaries/:id` | `BeneficiaryDetailPage` | Identité, statut, couverture, rattachement |
| `/beneficiaries/:id/activity` | `BeneficiaryActivityPage` | Vérifications et événements autorisés |
| `/beneficiaries/:id/coverage` | `BeneficiaryCoveragePage` | Historique de droits disponible |
| `/beneficiaries/:id/temporary-qr` | `BeneficiaryQrPage` | QR émis, révoqués, expirés |
| `/beneficiaries/:id/costs` | `BeneficiaryCostsPage` | Coûts agrégés, phase intégration financière |

Règles :

- pas de suppression depuis le web ;
- correction via workflow documenté ;
- NINA et informations sensibles masqués dans les listes ;
- données médicales non affichées par défaut ;
- accès à une donnée sensible journalisé.

## 4. Enrôlements

| Route | Page | Fonction |
|---|---|---|
| `/enrollments` | `EnrollmentsListPage` | Tous les dossiers autorisés |
| `/enrollments/pending` | `PendingEnrollmentsPage` | File de validation |
| `/enrollments/:id` | `EnrollmentDetailPage` | Détail, différences, historique |

Actions possibles selon permission :

- valider ;
- renvoyer pour correction avec commentaire obligatoire ;
- demander un contrôle manuel ;
- consulter la provenance et le statut de synchronisation.

## 5. Vérifications

| Route | Page | Fonction |
|---|---|---|
| `/verifications` | `VerificationsListPage` | Historique des vérifications |
| `/verifications/:id` | `VerificationDetailPage` | Résultat métier, contexte et audit |

Ne pas afficher de score biométrique brut dans la liste. La vue détail peut montrer une classe métier et des métadonnées techniques autorisées, jamais une photo brute.

## 6. Agents

| Route | Page | Fonction |
|---|---|---|
| `/agents` | `AgentsListPage` | Recherche, rôle, site, statut |
| `/agents/new` | `AgentCreatePage` | Création contrôlée |
| `/agents/:id` | `AgentDetailPage` | Profil, activité, statut |
| `/agents/:id/edit` | `AgentEditPage` | Champs autorisés |
| `/agents/:id/devices` | `AgentDevicesPage` | Appareils enrôlés et révoqués |

Actions : créer, modifier, valider, suspendre, réactiver, réinitialiser l'accès, révoquer un appareil. Pas de suppression définitive.

## 7. Établissements

| Route | Page | Fonction |
|---|---|---|
| `/establishments` | `EstablishmentsListPage` | Hôpitaux, cliniques, pharmacies, antennes |
| `/establishments/new` | `EstablishmentCreatePage` | Création |
| `/establishments/:id` | `EstablishmentDetailPage` | Informations, agents, appareils, activité |
| `/establishments/:id/edit` | `EstablishmentEditPage` | Modification autorisée |

## 8. Appareils

| Route | Page | Fonction |
|---|---|---|
| `/devices` | `DevicesListPage` | Inventaire et état de confiance |
| `/devices/:id` | `DeviceDetailPage` | Agent, site, dernière activité, révocation |

## 9. QR temporaires

| Route | Page | Fonction |
|---|---|---|
| `/temporary-qr` | `TemporaryQrListPage` | Suivi global |
| `/temporary-qr/:id` | `TemporaryQrDetailPage` | Validité, bénéficiaire masqué, usages |

Actions : révoquer avec motif, consulter les usages, exporter un justificatif autorisé. Pas de modification du jeton.

## 10. Alertes et fraude

| Route | Page | Fonction |
|---|---|---|
| `/alerts` | `AlertsListPage` | File d'alertes |
| `/alerts/:id` | `AlertDetailPage` | Événements liés, chronologie, décision |
| `/fraud/rules` | `FraudRulesPage` | Paramétrage futur, admin central uniquement |

Workflow : nouvelle → affectée → en analyse → confirmée / classée sans suite → escaladée → clôturée.

## 11. Rapports

| Route | Page | Fonction |
|---|---|---|
| `/reports` | `ReportsHomePage` | Catalogue |
| `/reports/operations` | `OperationsReportPage` | Enrôlements, vérifications, activité |
| `/reports/biometrics` | `BiometricReportPage` | Taux et motifs d'échec |
| `/reports/temporary-qr` | `QrReportPage` | Émissions, usages, révocations |
| `/reports/fraud` | `FraudReportPage` | Alertes et décisions |
| `/reports/costs` | `CostsReportPage` | Coûts, conditionné aux données financières |

## 12. Audit

| Route | Page | Fonction |
|---|---|---|
| `/audit` | `AuditLogPage` | Journal global lecture seule |
| `/audit/:id` | `AuditEventDetailPage` | Détail d'un événement |

## 13. Paramètres

| Route | Page | Fonction |
|---|---|---|
| `/settings/access` | `AccessSettingsPage` | Rôles et permissions |
| `/settings/biometrics` | `BiometricSettingsPage` | Seuils métier validés |
| `/settings/temporary-qr` | `QrSettingsPage` | Durées et règles |
| `/settings/retention` | `RetentionSettingsPage` | Politiques de conservation |
| `/settings/integrations` | `IntegrationsSettingsPage` | État des connecteurs |

Chaque changement de paramètre sensible exige confirmation, motif et audit.

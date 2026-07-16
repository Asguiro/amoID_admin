# 04 — Reporting, coûts et fraude

## 1. Familles de reporting

### Opérationnel

- enrôlements créés, complétés, validés, rejetés ;
- temps moyen de validation ;
- vérifications par jour, site, agent et résultat ;
- taux de succès biométrique ;
- actions hors-ligne synchronisées ou rejetées ;
- appareils actifs, inactifs, révoqués ;
- QR émis, utilisés, expirés, révoqués.

### Qualité

- dossiers incomplets ;
- doublons potentiels ;
- motifs d'échec de capture ;
- corrections demandées ;
- taux de reprise après échec.

### Contrôle et sécurité

- connexions inhabituelles ;
- accès hors périmètre ;
- volumes anormaux par agent/appareil ;
- échecs répétés ;
- QR réutilisés ou scannés après révocation ;
- consultations sensibles sans suite métier cohérente.

### Financier — uniquement après intégration

- coût total par bénéficiaire ;
- coût par prestation ;
- coût par établissement ;
- coût par période, région, catégorie et organisme ;
- fréquence des prestations ;
- montant facturé, montant accepté, montant rejeté, reste à charge ;
- concentration des dépenses ;
- évolution et comparaison à une population de référence.

## 2. Module « bénéficiaires qui coûtent le plus »

### Données minimales nécessaires

```txt
beneficiaryId
claimId
serviceDate
providerId
careType
procedureCode
amountBilled
amountEligible
amountPaid
amountRejected
prescriberId (si disponible)
regionId
status
```

Sans ces données, la page `/reports/costs` doit afficher un état explicite :

> Données financières non connectées. Les coûts ne peuvent pas être calculés à partir des seuls scans d'identité.

### Indicateurs

- coût AMO cumulé ;
- nombre de prestations ;
- coût moyen par prestation ;
- variation versus période précédente ;
- percentile dans une cohorte comparable ;
- principaux postes de coût ;
- établissements principaux ;
- alertes associées.

### Protection

- liste masquée par défaut ;
- accès détaillé réservé ;
- export nominatif interdit sans permission et motif ;
- coût élevé n'implique pas fraude : cas chroniques et soins lourds légitimes doivent être distingués.

## 3. Signaux de fraude ou d'anomalie

### Identité / biométrie

- échecs faciaux répétés sur un même bénéficiaire ;
- plusieurs personnes essayant le même identifiant ;
- correspondances multiples ou doublons de gabarit ;
- séquence anormale QR puis échec facial ;
- vérifications très rapprochées dans des sites éloignés.

### Agent / appareil

- volume nettement supérieur au profil du site ;
- activité en dehors des horaires autorisés ;
- appareil utilisé par plusieurs agents ;
- changement fréquent de site ou zone ;
- tentative d'accès à des dossiers hors périmètre ;
- multiplication de contrôles manuels.

### QR temporaire

- usages multiples au-delà du scénario autorisé ;
- scan après révocation ou expiration ;
- émission excessive par un agent ;
- motifs répétitifs inhabituels ;
- QR utilisé dans plusieurs sites en peu de temps.

### Financier, après intégration

- fréquence ou montant extrême par rapport à une cohorte ;
- répétition de la même prestation ;
- activité établissement atypique ;
- incohérence présence vérifiée / prestation déclarée ;
- facturation après suspension de droits ;
- liens inhabituels bénéficiaire-prescripteur-établissement.

## 4. Workflow des alertes

```txt
NEW
ASSIGNED
UNDER_REVIEW
NEEDS_INFORMATION
CONFIRMED
DISMISSED
ESCALATED
CLOSED
```

Chaque changement contient : utilisateur, date, ancienne valeur, nouvelle valeur, motif, commentaire et pièces de référence autorisées.

Aucune alerte ne déclenche automatiquement une suspension. Une mesure de protection temporaire peut exister seulement si la règle est validée et auditée.

## 5. Présentation dashboard

- KPI principal + comparaison période précédente ;
- graphique de tendance ;
- table des alertes prioritaires ;
- distribution par résultat ;
- top établissements ;
- top coûts seulement quand la source est disponible ;
- liens directs vers les détails filtrés.

## 6. Exports

- CSV pour analyse ;
- PDF signé pour rapport officiel, généré côté backend ;
- export asynchrone si volumineux ;
- journaliser demande, paramètres, auteur et téléchargement ;
- appliquer les mêmes filtres et permissions que l'écran.

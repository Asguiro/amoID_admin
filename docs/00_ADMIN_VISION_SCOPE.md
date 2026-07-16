# 00 — Vision et périmètre du Web Admin

## 1. Mission

Le back-office AMO ID Santé est le poste de pilotage pour les équipes CANAM/AMO, les superviseurs et les auditeurs. Il permet de :

- administrer agents, rôles, établissements et appareils autorisés ;
- rechercher et consulter les bénéficiaires selon les droits ;
- superviser les enrôlements, corrections et validations ;
- suivre les vérifications d'identité et d'éligibilité ;
- gérer les QR temporaires, leur révocation et leur usage ;
- consulter un journal d'audit immuable ;
- détecter et traiter les comportements suspects ;
- produire des rapports opérationnels et de contrôle ;
- analyser les coûts de prise en charge lorsque les données financières sont disponibles.

## 2. Principes non négociables

1. Une page ne montre que les données nécessaires au rôle connecté.
2. Les permissions sont appliquées côté loader/action et côté API, pas seulement dans le menu.
3. Un journal d'audit n'est ni modifiable ni supprimable depuis le web.
4. Un agent n'est pas supprimé définitivement : il est suspendu, désactivé ou archivé selon les règles métier.
5. Les données biométriques brutes ne sont jamais affichées dans les tableaux ou exports.
6. Les données médicales facultatives sont masquées par défaut et accessibles seulement avec permission explicite.
7. Toute action sensible exige un motif et produit une trace d'audit.
8. Une alerte de fraude est un signal à investiguer, jamais une preuve automatique de fraude.
9. Les coûts financiers ne sont jamais déduits du nombre de scans ou d'enrôlements.
10. L'interface doit rester institutionnelle, lisible et sobre.

## 3. Périmètre MVP admin

### Inclus

- authentification SSR et session sécurisée ;
- dashboard opérationnel ;
- gestion des agents et statuts ;
- gestion des établissements ;
- gestion des appareils ;
- consultation bénéficiaires ;
- validations d'enrôlement ;
- historique des vérifications ;
- gestion des QR temporaires ;
- audit global ;
- alertes simples fondées sur les événements disponibles ;
- rapports CSV côté serveur ;
- paramètres QR, biométrie et accès.

### Préparé mais conditionné par les intégrations

- bénéficiaires aux coûts les plus élevés ;
- coûts par établissement, prestation, prescripteur, région et période ;
- anomalies de facturation ou de remboursement ;
- scoring de fraude financière ;
- rapprochement feuilles de soins / identité / présence au point de soin.

### Hors MVP initial

- facturation médicale complète ;
- remboursement automatique ;
- dossier médical complet ;
- moteur de sanctions automatiques ;
- édition libre des logs ;
- suppression définitive de données sensibles depuis l'interface.

## 4. Utilisateurs

- Administrateur CANAM/AMO central ;
- Superviseur régional ;
- Superviseur d'établissement ;
- Auditeur / contrôleur ;
- Agent opérationnel avec accès web limité si validé ;
- rôle futur possible : analyste fraude, à confirmer avant implémentation.

## 5. Expérience cible

Le système doit permettre de répondre rapidement à cinq questions :

1. Que se passe-t-il aujourd'hui ?
2. Où se situent les anomalies ?
3. Qui a effectué l'action ?
4. Quel bénéficiaire ou établissement est concerné ?
5. Quelle décision doit être prise ensuite ?

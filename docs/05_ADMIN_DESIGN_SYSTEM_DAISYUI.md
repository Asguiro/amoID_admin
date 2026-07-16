# 05 — Design System Web Admin avec daisyUI

## 1. Direction

Le web reprend l'identité AMO mobile : institutionnel, premium, rassurant et lisible. Il ne reproduit pas les dimensions mobiles à l'identique.

### Continuité avec le mobile

- fond général `#F5F7FB` ;
- cartes blanches ;
- titres navy `#0B1B33` ;
- vert principal `#0E5B3B` ;
- succès `#18A058` ;
- attention `#F59E0B` ;
- danger `#EF4444` uniquement pour refus, révocation ou risque critique ;
- ombres légères ;
- icônes simples Lucide ;
- statuts métier, pas scores techniques bruts.

### Adaptation desktop

- sidebar 272 px ouverte, 80 px réduite ;
- topbar 72 px ;
- contenu max 1600 px ;
- cartes 20–24 px de rayon ;
- champs 14–16 px de rayon ;
- lignes de tableau 52–60 px ;
- densité ajustable `comfortable` / `compact`, sans descendre sous les cibles accessibles.

## 2. Hiérarchie

- un seul `h1` par page ;
- breadcrumb court ;
- titre + description + actions principales dans `PageHeader` ;
- maximum deux actions fortes visibles ;
- actions destructives séparées et confirmées ;
- filtres avancés dans un drawer ou panneau repliable.

## 3. Composants à créer au-dessus de daisyUI

```txt
AppShell
SidebarNav
Topbar
PageHeader
AppCard
MetricCard
StatusBadge
TrendBadge
DataTable
DataTableToolbar
FilterBar
DateRangeField
SearchField
EmptyState
ErrorState
LoadingSkeleton
ConfirmDialog
SensitiveDataReveal
AuditTimeline
AlertSeverityBadge
ChartCard
ExportButton
FilterSelect
DetailPageLayout
DetailSectionCard
EntityAvatar
PreparedMediaSlot
MediaGallery
DocumentRow
MediaPreviewDialog
```

Les pages utilisent ces composants. Elles ne combinent pas librement des classes daisyUI différentes pour recréer le même pattern.

### Recherche et filtres

- aucune recherche globale dans la topbar ;
- chaque recherche est locale, contextualisée et placée dans `FilterBar` ;
- `SearchField` utilise la structure `input` daisyUI sans icône positionnée au-dessus du texte ;
- les filtres actifs sont comptés et peuvent être réinitialisés ;
- pagination, taille de page et filtres conservent un état URL partageable.

### Détails et médias

- `EntityAvatar` affiche une image autorisée ou un placeholder par initiales ;
- `DetailSectionCard` standardise titre, description, badge et action ;
- `MediaAsset` distingue contenu disponible, absent, restreint, en traitement et source non connectée ;
- aucune image sensible n’est chargée ou révélée sans permission explicite ;
- un emplacement préparatoire ne doit jamais simuler un document ou une capture inexistant.

### Statistiques

- les KPI utilisent les slots `stat-*` daisyUI dans une grille AMO responsive ;
- la direction numérique et l’impact métier d’une tendance sont distincts ;
- les motifs AMO restent discrets et réservés aux surfaces mises en avant ;
- les graphiques sont simples et actionnables : une courbe ou des barres, avec titre, période et résumé textuel.

## 4. Thème

Le fichier `app-starter/app/styles/app.css` contient un thème daisyUI nommé `amo-admin`.

Correspondance :

| daisyUI | AMO |
|---|---|
| `base-100` | carte blanche |
| `base-200` | fond écran |
| `base-content` | navy |
| `primary` | vert institutionnel |
| `success` | vert éligibilité |
| `warning` | doute / mise à jour |
| `error` | refus / danger |
| `neutral` | texte et navigation sombre |

## 5. Tableaux

- en-tête sticky si utile ;
- colonnes prioritaires visibles sur petits écrans ;
- actions dans menu contextuel ;
- statut en badge ;
- tri et filtres reflétés dans l'URL ;
- skeleton pendant navigation ;
- pagination serveur ;
- aucune couleur comme seul moyen de comprendre un statut.

## 6. Graphiques

- titre, période et source visibles ;
- valeur résumée en texte avant le graphique ;
- légende claire ;
- tooltips formatés ;
- tableau alternatif ou résumé accessible ;
- pas plus de 5 séries simultanées sans justification ;
- pas de camembert avec trop de catégories ;
- pas de 3D.

## 7. Responsive

### Desktop ≥ 1280

Sidebar fixe, dashboard en grille, tables complètes.

### Tablette 768–1279

Sidebar repliable, cartes sur 2 colonnes, tables avec colonnes secondaires masquées.

### Mobile < 768

Usage d'appoint : navigation drawer, cartes empilées, listes transformées en rows. Les workflows lourds restent optimisés desktop/tablette.

## 8. Accessibilité

- contraste WCAG AA ;
- focus visible ;
- navigation clavier complète ;
- labels explicites ;
- modales avec focus trap ;
- `aria-live` pour résultats d'action ;
- icônes décoratives avec `aria-hidden` ;
- graphiques avec résumé textuel.

## 9. À éviter

- design violet/bleu générique de template SaaS ;
- grands gradients ;
- cartes trop nombreuses sans hiérarchie ;
- tableaux ultra compacts ;
- pictogrammes remplis lourds ;
- dark mode avant stabilisation du thème clair, sauf exigence validée ;
- copie de l'image de référence.

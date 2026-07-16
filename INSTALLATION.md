# Installation recommandée

## 1. Base React Router v7 SSR

Dans un projet déjà créé, conserver les versions React Router définies par le scaffold et vérifier que `react-router.config.ts` contient `ssr: true`.

## 2. UI et fondations

```bash
pnpm add zod @tanstack/react-table echarts lucide-react date-fns clsx
pnpm add -D tailwindcss @tailwindcss/vite daisyui vite-tsconfig-paths
```

Rôle des packages :

- `zod` : validation des formulaires, paramètres URL et payloads API ;
- `@tanstack/react-table` : tableaux complexes, tri, filtres, sélection, pagination pilotée par le serveur ;
- `echarts` : graphiques opérationnels, financiers et de détection d'anomalies ;
- `lucide-react` : icônes cohérentes et importées individuellement ;
- `date-fns` : formats, périodes, comparaisons et libellés de dates ;
- `clsx` : composition contrôlée des classes ;
- `tailwindcss`, `@tailwindcss/vite`, `daisyui` : styles et composants.

## 3. Tests

```bash
pnpm add -D vitest jsdom \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  @playwright/test @axe-core/playwright msw @faker-js/faker
```

Puis :

```bash
pnpm exec playwright install
```

## 4. Ce qu'il ne faut pas ajouter par défaut

- Pas de Redux/Zustand pour stocker des données serveur.
- Pas de TanStack Query pour du chargement standard déjà géré par les loaders/actions React Router.
- Pas de seconde bibliothèque de composants concurrente à daisyUI.
- Pas de bibliothèque de data grid payante pour le MVP.
- Pas de générateur PDF côté navigateur pour les rapports officiels : demander au backend un export signé et traçable.

TanStack Query pourra être ajouté plus tard uniquement pour un besoin justifié de flux temps réel ou de polling complexe qui ne s'intègre pas proprement à `useFetcher`/`useRevalidator`.

## 5. Vite + Tailwind CSS 4

Adapter `vite.config.ts` à partir de `app-starter/vite.config.ts.example`, puis importer `app/styles/app.css` dans `app/root.tsx`.

## 6. Variables d'environnement minimales

```env
API_URL=http://localhost:4000
SESSION_SECRET=replace-with-a-long-random-secret
APP_ENV=development
```

Règles :

- `API_URL` reste server-only ;
- ne pas utiliser `VITE_API_URL` pour les appels métier principaux ;
- les secrets ne doivent jamais être accessibles dans les composants navigateur.

## 7. Scripts conseillés

```json
{
  "scripts": {
    "dev": "react-router dev",
    "build": "react-router build",
    "start": "react-router-serve ./build/server/index.js",
    "typecheck": "react-router typegen && tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:a11y": "playwright test tests/a11y",
    "check": "pnpm typecheck && pnpm test && pnpm test:e2e"
  }
}
```

## 8. Vérification après installation

```bash
pnpm typecheck
pnpm build
pnpm test
```

La première feature à implémenter est le shell authentifié + dashboard opérationnel, pas la totalité des modules en une seule passe.

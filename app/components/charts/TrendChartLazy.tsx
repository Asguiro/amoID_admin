import { lazy, Suspense } from "react";

import type { DashboardSeriesPoint } from "~/types/admin";

const LazyTrendChart = lazy(async () => {
  const mod = await import("~/components/charts/TrendChart");
  return { default: mod.TrendChart };
});

export function TrendChartLazy({ series }: { series: DashboardSeriesPoint[] }) {
  return (
    <Suspense
      fallback={
        <div
          className="skeleton h-[280px] w-full rounded-2xl"
          role="status"
          aria-label="Chargement du graphique"
        />
      }
    >
      <LazyTrendChart series={series} />
    </Suspense>
  );
}

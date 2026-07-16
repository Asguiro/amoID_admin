import { Form, Link, useNavigation } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import clsx from "clsx";
import {
  Activity,
  Fingerprint,
  QrCode,
  ShieldAlert,
  UserRoundCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { TrendChartLazy } from "~/components/charts/TrendChartLazy";
import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { ChartCard } from "~/components/ui/ChartCard";
import { EmptyState } from "~/components/ui/EmptyState";
import { MetricCard } from "~/components/ui/MetricCard";
import { AlertSeverityBadge } from "~/components/ui/StatusBadge";
import type { DashboardOverview, DashboardPeriod } from "~/types/admin";

const PERIODS: Array<{ value: DashboardPeriod; label: string }> = [
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "90d", label: "90 jours" },
];

const KPI_META: Record<
  string,
  { icon: LucideIcon; tint: "mint" | "gold" | "sky" | "rose"; featured?: boolean }
> = {
  enrollments: { icon: UserRoundCheck, tint: "mint", featured: true },
  verifications_ok: { icon: Fingerprint, tint: "sky" },
  verifications_doubt: { icon: ShieldAlert, tint: "rose" },
  qr_active: { icon: QrCode, tint: "mint" },
  pending_sync: { icon: Activity, tint: "gold" },
  incomplete_dossiers: { icon: Users, tint: "gold" },
  provisional_pending: { icon: UserRoundCheck, tint: "gold" },
  alerts_critical: { icon: ShieldAlert, tint: "rose" },
};

function resolveKpiMeta(id: string, index: number) {
  if (KPI_META[id]) return KPI_META[id];
  const fallbacks = Object.values(KPI_META);
  return fallbacks[index % fallbacks.length]!;
}

interface DashboardPageProps {
  overview: DashboardOverview;
}

export function DashboardPage({ overview }: DashboardPageProps) {
  const navigation = useNavigation();
  const isFiltering =
    navigation.state === "loading" &&
    navigation.location?.pathname === "/dashboard";

  return (
    <div className={clsx(isFiltering && "opacity-60 transition-opacity")}>
      <PageHeader
        title="Vue d'ensemble"
        description="Pilotage opérationnel des enrôlements, vérifications et alertes."
        actions={
          <Form method="get" aria-label="Période du tableau de bord" className="join flex flex-wrap rounded-2xl bg-base-100 p-1 shadow-[0_8px_24px_rgb(11_27_51/0.05)]">
            {PERIODS.map((period) => (
              <button
                key={period.value}
                type="submit"
                name="period"
                value={period.value}
                className={clsx(
                  "btn btn-sm join-item rounded-xl border-0",
                  overview.period === period.value
                    ? "btn-primary"
                    : "btn-ghost",
                )}
                aria-pressed={overview.period === period.value}
              >
                {period.label}
              </button>
            ))}
          </Form>
        }
      />

      {overview.kpis.length === 0 ? (
        <EmptyState
          title="Aucun indicateur disponible"
          description="Aucune donnée de pilotage n’est disponible pour la période sélectionnée."
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-labelledby="dashboard-kpi-title">
          <h2 id="dashboard-kpi-title" className="sr-only">Indicateurs clés</h2>
          {overview.kpis.map((kpi, index) => {
            const meta = resolveKpiMeta(kpi.id, index);
            return (
              <MetricCard
                key={kpi.id}
                label={kpi.label}
                value={kpi.value}
                unit={kpi.unit}
                trendPercent={kpi.trendPercent}
                trendIntent={kpi.trendIntent}
                icon={meta.icon}
                tint={meta.tint}
                featured={Boolean(meta.featured && index === 0)}
                className={clsx(
                  "amo-animate-in",
                  index === 1 && "amo-animate-in-delay-1",
                  index === 2 && "amo-animate-in-delay-2",
                )}
              />
            );
          })}
        </section>
      )}

      {overview.series.length > 0 ? (
        <ChartCard
          title="Évolution des enrôlements"
          description="Volume d’enrôlements sur la période sélectionnée."
          summary={`Courbe simple de ${overview.series.length} points représentant l’évolution des enrôlements.`}
          className="mt-6 amo-animate-in amo-animate-in-delay-1"
        >
          <TrendChartLazy series={overview.series} />
        </ChartCard>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <AppCard className="amo-animate-in amo-animate-in-delay-1" padding="lg">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="amo-display text-lg font-semibold text-secondary">
                Alertes prioritaires
              </h2>
              <p className="mt-0.5 text-sm text-base-content/55">
                Signaux critiques et hauts à traiter
              </p>
            </div>
            <Link to="/alerts" className="btn btn-ghost btn-sm rounded-xl text-primary">
              Voir tout
            </Link>
          </div>
          {overview.priorityAlerts.length === 0 ? (
            <EmptyState
              nested
              title="Aucune alerte prioritaire"
              description="Aucune alerte critique ou haute pour la période sélectionnée."
            />
          ) : (
            <ul className="space-y-3">
              {overview.priorityAlerts.map((alert) => (
                <li
                  key={alert.id}
                  className="rounded-2xl bg-base-200/70 px-4 py-3.5 transition-colors hover:bg-base-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-secondary">{alert.title}</p>
                      <p className="mt-1 text-xs text-base-content/55">
                        {formatDistanceToNow(new Date(alert.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                    </div>
                    <AlertSeverityBadge severity={alert.severity} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AppCard>

        <AppCard className="amo-animate-in amo-animate-in-delay-2" padding="lg">
          <div className="mb-5">
            <h2 className="amo-display text-lg font-semibold text-secondary">
              Activité récente
            </h2>
            <p className="mt-0.5 text-sm text-base-content/55">
              Derniers événements opérationnels
            </p>
          </div>
          {overview.recentActivity.length === 0 ? (
            <EmptyState nested title="Aucune activité récente" />
          ) : (
            <ul className="space-y-1">
              {overview.recentActivity.map((item, index) => (
                <li
                  key={item.id}
                  className={clsx(
                    "flex items-start gap-3 rounded-2xl px-2 py-3",
                    index !== overview.recentActivity.length - 1 &&
                      "border-b border-base-300/60",
                  )}
                >
                  <span
                    className="mt-1.5 size-2 shrink-0 rounded-full bg-primary/70"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-secondary">{item.label}</p>
                    <p className="text-xs text-base-content/55">{item.actor}</p>
                  </div>
                  <time dateTime={item.createdAt} className="shrink-0 text-xs text-base-content/45">
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </AppCard>
      </div>

      <p className="mt-5 text-xs text-base-content/45">
        Données générées le{" "}
        <time dateTime={overview.generatedAt}>
          {new Date(overview.generatedAt).toLocaleString("fr-FR")}
        </time>{" "}
        — période{" "}
        {overview.period}
      </p>
    </div>
  );
}

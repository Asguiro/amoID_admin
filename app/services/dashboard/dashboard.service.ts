import { apiRequest } from "~/server/api/client.server";
import type {
  AdminSessionUser,
  DashboardOverview,
  DashboardPeriod,
  DashboardSeriesPoint,
} from "~/types/admin";

type SummaryResponse = {
  generatedAt: string;
  kpis: DashboardOverview["kpis"];
};

type TrendsResponse = {
  generatedAt: string;
  points: Array<{ date: string; verifications: number; enrollments?: number; alerts?: number }>;
};

type AlertsResponse = {
  items: DashboardOverview["priorityAlerts"];
};

function mapSeries(
  points: TrendsResponse["points"],
): DashboardSeriesPoint[] {
  return points.map((point) => ({
    date: point.date.includes("T") ? point.date : `${point.date}T00:00:00.000Z`,
    enrollments: point.enrollments ?? 0,
    verifications: point.verifications ?? 0,
    alerts: point.alerts ?? 0,
  }));
}

export async function getDashboardOverview(input: {
  user: AdminSessionUser;
  period: DashboardPeriod;
  empty?: boolean;
  accessToken: string;
}): Promise<DashboardOverview> {
  void input.user;

  if (input.empty) {
    return {
      period: input.period,
      generatedAt: new Date().toISOString(),
      kpis: [],
      priorityAlerts: [],
      recentActivity: [],
      series: [],
      empty: true,
    };
  }

  const [summary, trends, alerts] = await Promise.all([
    apiRequest<SummaryResponse>("/admin/dashboard/summary", {
      accessToken: input.accessToken,
    }),
    apiRequest<TrendsResponse>("/admin/dashboard/trends", {
      accessToken: input.accessToken,
    }),
    apiRequest<AlertsResponse>("/admin/dashboard/alerts", {
      accessToken: input.accessToken,
    }),
  ]);

  return {
    period: input.period,
    generatedAt: summary.generatedAt ?? trends.generatedAt ?? new Date().toISOString(),
    kpis: summary.kpis ?? [],
    priorityAlerts: alerts.items ?? [],
    recentActivity: [],
    series: mapSeries(trends.points ?? []),
  };
}

import { permissions, hasPermission } from "~/config/permissions";
import { apiRequest } from "~/server/api/client.server";
import { ApiClientError } from "~/server/api/errors.server";
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
  request?: Request;
}): Promise<DashboardOverview> {
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

  const canReadAlerts = hasPermission(
    input.user.permissions,
    permissions.alertRead,
  );

  try {
    const [summary, trends, alerts] = await Promise.all([
      apiRequest<SummaryResponse>("/admin/dashboard/summary", {
        accessToken: input.accessToken,
        request: input.request,
      }),
      apiRequest<TrendsResponse>("/admin/dashboard/trends", {
        accessToken: input.accessToken,
        request: input.request,
      }),
      canReadAlerts
        ? apiRequest<AlertsResponse>("/admin/dashboard/alerts", {
            accessToken: input.accessToken,
            request: input.request,
          })
        : Promise.resolve({ items: [] }),
    ]);

    return {
      period: input.period,
      generatedAt:
        summary.generatedAt ?? trends.generatedAt ?? new Date().toISOString(),
      kpis: summary.kpis ?? [],
      priorityAlerts: alerts.items ?? [],
      recentActivity: [],
      series: mapSeries(trends.points ?? []),
    };
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(500, {
      code: "DASHBOARD_LOAD_FAILED",
      message: "Impossible de charger le tableau de bord.",
      correlationId: `dashboard-${crypto.randomUUID()}`,
    });
  }
}

import { permissions } from "~/config/permissions";
import { getDashboardOverview } from "~/services/dashboard/dashboard.service";
import { parseDashboardSearchParams } from "~/utils/search-params";

import { requireAnyPermission } from "../auth/require-permission.server";

export async function loadDashboard(request: Request) {
  const user = await requireAnyPermission(request, [
    permissions.dashboardReadGlobal,
    permissions.dashboardReadRegion,
    permissions.dashboardReadEstablishment,
  ]);

  const { period, empty, forceError } = parseDashboardSearchParams(
    new URL(request.url).searchParams,
  );

  if (forceError) {
    throw new Response(
      JSON.stringify({
        message: "Impossible de charger le tableau de bord.",
        correlationId: `dashboard-${crypto.randomUUID()}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const overview = await getDashboardOverview({ user, period, empty });

  return {
    user,
    overview,
  };
}

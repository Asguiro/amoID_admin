import { permissions } from "~/config/permissions";
import { getDashboardOverview } from "~/services/dashboard/dashboard.service";
import { parseDashboardSearchParams } from "~/utils/search-params";

import { requireAnyPermission } from "../auth/require-permission.server";
import { ApiClientError } from "../api/errors.server";
import { requireAccessToken } from "../session.server";

export async function loadDashboard(request: Request) {
  const user = await requireAnyPermission(request, [
    permissions.dashboardReadGlobal,
    permissions.dashboardReadRegion,
    permissions.dashboardReadEstablishment,
  ]);
  const accessToken = await requireAccessToken(request);

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

  try {
    const overview = await getDashboardOverview({
      user,
      period,
      empty,
      accessToken,
      request,
    });

    return {
      user,
      overview,
    };
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw new Response(
        JSON.stringify({
          message: error.message,
          correlationId: error.payload.correlationId,
        }),
        {
          status: error.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    throw error;
  }
}

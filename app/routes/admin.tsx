import { data } from "react-router";

import { AdminShell } from "~/components/layouts/AdminShell";
import { permissions } from "~/config/permissions";
import { requireAuth } from "~/server/auth/require-auth.server";
import { ensureCsrfToken } from "~/server/security/csrf.server";
import { getAccessTokenFromRequest } from "~/server/session.server";
import { listAlerts } from "~/services/alerts/alert.service";
import { hasAnyPermission } from "~/config/permissions";
import type { Route } from "./+types/admin";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  const { token, setCookieHeader } = await ensureCsrfToken(request);

  let alertCount = 0;
  const accessToken = await getAccessTokenFromRequest(request);
  if (
    accessToken &&
    hasAnyPermission(user.permissions, [permissions.alertRead])
  ) {
    try {
      const alerts = await listAlerts(
        { page: 1, pageSize: 50, status: "NEW" },
        accessToken,
      );
      alertCount = alerts.pagination.totalItems;
    } catch {
      alertCount = 0;
    }
  }

  return data(
    { user, csrfToken: token, alertCount },
    setCookieHeader
      ? { headers: { "Set-Cookie": setCookieHeader } }
      : undefined,
  );
}

export default function AdminLayoutRoute({
  loaderData,
}: Route.ComponentProps) {
  return (
    <AdminShell
      user={loaderData.user}
      csrfToken={loaderData.csrfToken}
      alertCount={loaderData.alertCount}
    />
  );
}

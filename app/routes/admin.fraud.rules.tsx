import { permissions } from "~/config/permissions";
import { FraudRulesPage } from "~/pages/settings/SettingsPages";
import { requireAnyPermission } from "~/server/auth/require-permission.server";
import type { Route } from "./+types/admin.fraud.rules";

export function loader({ request }: Route.LoaderArgs) {
  return requireAnyPermission(request, [
    permissions.settingsRead,
    permissions.alertDecide,
  ]);
}

export default function FraudRulesRoute() {
  return <FraudRulesPage />;
}

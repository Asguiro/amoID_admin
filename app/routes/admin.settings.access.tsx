import { permissions } from "~/config/permissions";
import { AccessSettingsPage } from "~/pages/settings/SettingsPages";
import { requirePermission } from "~/server/auth/require-permission.server";
import type { Route } from "./+types/admin.settings.access";

export function loader({ request }: Route.LoaderArgs) {
  return requirePermission(request, permissions.settingsRead);
}

export default function AccessSettingsRoute() {
  return <AccessSettingsPage />;
}

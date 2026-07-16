import { permissions } from "~/config/permissions";
import { ComingSoonPage } from "~/pages/common/ComingSoonPage";
import { requirePermission } from "~/server/auth/require-permission.server";
import type { Route } from "./+types/admin.settings.other";

export function loader({ request }: Route.LoaderArgs) {
  return requirePermission(request, permissions.settingsRead);
}

export default function OtherSettingsRoute() {
  return <ComingSoonPage title="Paramètres" description="Configuration métier et intégrations de la plateforme." phase="Phase ultérieure" />;
}

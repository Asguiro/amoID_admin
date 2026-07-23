import { DevicesListPage } from "~/pages/devices/DevicesListPage";
import { permissions } from "~/config/permissions";
import { loadAgentDevices } from "~/server/agents/agents.loader.server";
import { requirePermission } from "~/server/auth/require-permission.server";
import type { Route } from "./+types/admin.agents.$id.devices";

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await requirePermission(request, permissions.deviceRead);
  const data = await loadAgentDevices(request, params.id);
  return {
    ...data,
    canEnroll: user.permissions.includes(permissions.deviceTrust),
  };
}
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return (
    <DevicesListPage
      agent={loaderData.agent}
      data={loaderData.devices}
      query={loaderData.query}
      canEnroll={loaderData.canEnroll}
    />
  );
}

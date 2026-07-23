import { DevicesListPage } from "~/pages/devices/DevicesListPage";
import { permissions } from "~/config/permissions";
import { loadDevicesList } from "~/server/devices/devices.loader.server";
import { requirePermission } from "~/server/auth/require-permission.server";
import type { Route } from "./+types/admin.devices._index";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requirePermission(request, permissions.deviceRead);
  const data = await loadDevicesList(request);
  return {
    ...data,
    canEnroll: user.permissions.includes(permissions.deviceTrust),
  };
}
export function meta() {
  return [{ title: "Appareils — AMO ID Admin" }];
}
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return (
    <DevicesListPage
      data={loaderData.devices}
      query={loaderData.query}
      pendingSync={loaderData.pendingSync}
      stats={loaderData.stats}
      canEnroll={loaderData.canEnroll}
    />
  );
}

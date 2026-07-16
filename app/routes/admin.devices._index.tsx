import { DevicesListPage } from "~/pages/devices/DevicesListPage";
import { loadDevicesList } from "~/server/devices/devices.loader.server";
import type { Route } from "./+types/admin.devices._index";

export function loader({ request }: Route.LoaderArgs) {
  return loadDevicesList(request);
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
    />
  );
}

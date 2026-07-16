import { DeviceDetailPage } from "~/pages/devices/DeviceDetailPage";
import { loadDeviceDetail, revokeDeviceAction } from "~/server/devices/devices.loader.server";
import type { Route } from "./+types/admin.devices.$id";

export function loader({ request, params }: Route.LoaderArgs) {
  return loadDeviceDetail(request, params.id);
}
export function action({ request, params }: Route.ActionArgs) {
  return revokeDeviceAction(request, params.id);
}
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <DeviceDetailPage device={loaderData.device} />;
}

import {
  createDeviceAction,
  loadDeviceCreate,
} from "~/server/devices/devices.loader.server";
import { DeviceEnrollPage } from "~/pages/devices/DeviceEnrollPage";
import type { Route } from "./+types/admin.devices.new";

export function loader({ request }: Route.LoaderArgs) {
  return loadDeviceCreate(request);
}

export function action({ request }: Route.ActionArgs) {
  return createDeviceAction(request);
}

export function meta() {
  return [{ title: "Enrôler un appareil — AMO ID Admin" }];
}

export default function RouteComponent({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  return (
    <DeviceEnrollPage
      agents={loaderData.agents}
      preselectedAgentId={loaderData.preselectedAgentId}
      actionData={actionData}
    />
  );
}

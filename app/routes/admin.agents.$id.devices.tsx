import { DevicesListPage } from "~/pages/devices/DevicesListPage";
import { loadAgentDevices } from "~/server/agents/agents.loader.server";
import type { Route } from "./+types/admin.agents.$id.devices";

export function loader({ request, params }: Route.LoaderArgs) {
  return loadAgentDevices(request, params.id);
}
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <DevicesListPage agent={loaderData.agent} data={loaderData.devices} query={loaderData.query} />;
}

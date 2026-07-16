import { AgentsListPage } from "~/pages/agents/AgentsListPage";
import { loadAgentsList } from "~/server/agents/agents.loader.server";
import type { Route } from "./+types/admin.agents._index";

export function loader({ request }: Route.LoaderArgs) {
  return loadAgentsList(request);
}
export function meta() {
  return [{ title: "Agents — AMO ID Admin" }];
}
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <AgentsListPage data={loaderData.agents} query={loaderData.query} />;
}

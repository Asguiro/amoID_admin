import { AgentDetailPage } from "~/pages/agents/AgentDetailPage";
import { agentStatusAction, loadAgentDetail } from "~/server/agents/agents.loader.server";
import type { Route } from "./+types/admin.agents.$id";

export function loader({ request, params }: Route.LoaderArgs) {
  return loadAgentDetail(request, params.id);
}
export function action({ request, params }: Route.ActionArgs) {
  return agentStatusAction(request, params.id);
}
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <AgentDetailPage agent={loaderData.agent} />;
}

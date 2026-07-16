import { AgentFormPage } from "~/pages/agents/AgentFormPage";
import { loadAgentEdit, updateAgentAction } from "~/server/agents/agents.loader.server";
import type { Route } from "./+types/admin.agents.$id.edit";

export function loader({ request, params }: Route.LoaderArgs) {
  return loadAgentEdit(request, params.id);
}
export function action({ request, params }: Route.ActionArgs) {
  return updateAgentAction(request, params.id);
}
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <AgentFormPage agent={loaderData.agent} establishments={loaderData.establishments} />;
}

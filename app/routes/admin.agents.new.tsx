import { AgentFormPage } from "~/pages/agents/AgentFormPage";
import { createAgentAction, loadAgentCreate } from "~/server/agents/agents.loader.server";
import type { Route } from "./+types/admin.agents.new";

export function loader({ request }: Route.LoaderArgs) {
  return loadAgentCreate(request);
}
export function action({ request }: Route.ActionArgs) {
  return createAgentAction(request);
}
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <AgentFormPage establishments={loaderData.establishments} />;
}

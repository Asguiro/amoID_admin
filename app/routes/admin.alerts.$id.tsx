import { AlertDetailPage } from "~/pages/alerts/AlertPages";
import { loadAlertDetail, mutateAlert } from "~/server/alerts/alert.server";
import type { Route } from "./+types/admin.alerts.$id";

export function loader({ request, params }: Route.LoaderArgs) {
  return loadAlertDetail(request, params.id);
}

export function action({ request, params }: Route.ActionArgs) {
  return mutateAlert(request, params.id);
}

export default function AlertDetailRoute({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  return (
    <AlertDetailPage
      alert={loaderData.alert}
      userPermissions={loaderData.permissions}
      assignableAgents={loaderData.assignableAgents}
      actionData={actionData}
    />
  );
}

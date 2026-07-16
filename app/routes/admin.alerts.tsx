import { AlertsListPage } from "~/pages/alerts/AlertPages";
import { loadAlertList } from "~/server/alerts/alert.server";
import type { Route } from "./+types/admin.alerts";

export function loader({ request }: Route.LoaderArgs) {
  return loadAlertList(request);
}

export function meta() {
  return [{ title: "Alertes et fraude — AMO ID Admin" }];
}

export default function AlertsRoute({ loaderData }: Route.ComponentProps) {
  return <AlertsListPage result={loaderData.result} query={loaderData.query} />;
}

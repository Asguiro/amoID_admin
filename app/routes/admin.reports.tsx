import { ReportsHubPage } from "~/pages/reports/ReportPages";
import { loadReportsHub } from "~/server/reports/report.server";
import type { Route } from "./+types/admin.reports";

export function loader({ request }: Route.LoaderArgs) {
  return loadReportsHub(request);
}

export function meta() {
  return [{ title: "Rapports — AMO ID Admin" }];
}

export default function ReportsRoute({ loaderData }: Route.ComponentProps) {
  return <ReportsHubPage reports={loaderData.reports} />;
}

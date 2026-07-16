import { permissions } from "~/config/permissions";
import { OperationsReportPage } from "~/pages/reports/ReportPages";
import { createReportExport, loadOperationsReport } from "~/server/reports/report.server";
import type { Route } from "./+types/admin.reports.operations";

export function loader({ request }: Route.LoaderArgs) {
  return loadOperationsReport(request);
}

export function action({ request }: Route.ActionArgs) {
  return createReportExport(request, "operations");
}

export default function OperationsReportRoute({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <OperationsReportPage
      report={loaderData.report}
      canExport={loaderData.permissions.includes(permissions.reportExport)}
      exportJob={actionData?.job}
    />
  );
}

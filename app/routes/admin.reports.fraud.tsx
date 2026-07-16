import { permissions } from "~/config/permissions";
import { FraudReportPage } from "~/pages/reports/ReportPages";
import { createReportExport, loadFraudReport } from "~/server/reports/report.server";
import type { Route } from "./+types/admin.reports.fraud";

export function loader({ request }: Route.LoaderArgs) {
  return loadFraudReport(request);
}

export function action({ request }: Route.ActionArgs) {
  return createReportExport(request, "fraud");
}

export default function FraudReportRoute({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <FraudReportPage
      report={loaderData.report}
      canExport={loaderData.permissions.includes(permissions.reportExport)}
      exportJob={actionData?.job}
    />
  );
}

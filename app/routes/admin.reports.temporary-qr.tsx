import { permissions } from "~/config/permissions";
import { QrReportPage } from "~/pages/reports/ReportPages";
import { createReportExport, loadQrReport } from "~/server/reports/report.server";
import type { Route } from "./+types/admin.reports.temporary-qr";

export function loader({ request }: Route.LoaderArgs) {
  return loadQrReport(request);
}

export function action({ request }: Route.ActionArgs) {
  return createReportExport(request, "temporary-qr");
}

export default function QrReportRoute({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <QrReportPage
      report={loaderData.report}
      canExport={loaderData.permissions.includes(permissions.reportExport)}
      exportJob={actionData?.job}
    />
  );
}

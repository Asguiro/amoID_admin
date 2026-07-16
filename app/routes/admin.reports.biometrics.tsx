import { permissions } from "~/config/permissions";
import { BiometricsReportPage } from "~/pages/reports/ReportPages";
import { createReportExport, loadBiometricsReport } from "~/server/reports/report.server";
import type { Route } from "./+types/admin.reports.biometrics";

export function loader({ request }: Route.LoaderArgs) {
  return loadBiometricsReport(request);
}

export function action({ request }: Route.ActionArgs) {
  return createReportExport(request, "biometrics");
}

export default function BiometricsReportRoute({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <BiometricsReportPage
      report={loaderData.report}
      canExport={loaderData.permissions.includes(permissions.reportExport)}
      exportJob={actionData?.job}
    />
  );
}

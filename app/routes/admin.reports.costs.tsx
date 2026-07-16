import { permissions } from "~/config/permissions";
import { CostsReportPage } from "~/pages/costs/CostPages";
import { requirePermission } from "~/server/auth/require-permission.server";
import { getCostReport } from "~/services/costs/cost.service";
import type { Route } from "./+types/admin.reports.costs";

export async function loader({ request }: Route.LoaderArgs) {
  await requirePermission(request, permissions.reportRead);
  await requirePermission(request, permissions.beneficiaryReadCosts);
  const query = new URL(request.url).searchParams.get("q") ?? "";
  return { report: await getCostReport(query), query };
}

export function meta() {
  return [{ title: "Rapport coûts — AMO ID Admin" }];
}

export default function CostsReportRoute({ loaderData }: Route.ComponentProps) {
  return <CostsReportPage report={loaderData.report} query={loaderData.query} />;
}

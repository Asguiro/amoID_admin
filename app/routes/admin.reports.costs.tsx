import { CostsBlockedPage } from "~/pages/common/CostsBlockedPage";
import { permissions } from "~/config/permissions";
import { requirePermission } from "~/server/auth/require-permission.server";
import type { Route } from "./+types/admin.reports.costs";

export async function loader({ request }: Route.LoaderArgs) {
  await requirePermission(request, permissions.reportRead);
  return null;
}

export function meta() {
  return [{ title: "Rapport coûts — AMO ID Admin" }];
}

export default function CostsReportRoute() {
  return (
    <CostsBlockedPage
      title="Rapport des coûts"
      description="Les indicateurs financiers seront activés après connexion des prestations AMO."
    />
  );
}

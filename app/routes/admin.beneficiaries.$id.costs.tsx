import { CostsBlockedPage } from "~/pages/common/CostsBlockedPage";
import { permissions } from "~/config/permissions";
import { requirePermission } from "~/server/auth/require-permission.server";
import type { Route } from "./+types/admin.beneficiaries.$id.costs";

export async function loader({ request }: Route.LoaderArgs) {
  await requirePermission(request, permissions.beneficiaryReadCosts);
  return null;
}

export function meta() {
  return [{ title: "Coûts bénéficiaire — AMO ID Admin" }];
}

export default function BeneficiaryCostsRoute() {
  return (
    <CostsBlockedPage
      title="Coûts du bénéficiaire"
      description="Les coûts nominatifs restent masqués tant que les sources financières ne sont pas validées."
    />
  );
}

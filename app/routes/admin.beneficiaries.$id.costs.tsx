import { permissions } from "~/config/permissions";
import { BeneficiaryCostsPage } from "~/pages/costs/CostPages";
import { requirePermission } from "~/server/auth/require-permission.server";
import { requireAccessToken } from "~/server/session.server";
import { getBeneficiaryDetail } from "~/services/beneficiaries/beneficiary.service";
import { getBeneficiaryCostProfile } from "~/services/costs/cost.service";
import type { Route } from "./+types/admin.beneficiaries.$id.costs";

export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePermission(request, permissions.beneficiaryReadCosts);
  const accessToken = await requireAccessToken(request);
  const beneficiary = await getBeneficiaryDetail(params.id, accessToken);
  if (!beneficiary) throw new Response("Bénéficiaire introuvable", { status: 404 });

  const profile = await getBeneficiaryCostProfile(
    params.id,
    beneficiary.displayName,
  );
  return { profile };
}

export function meta() {
  return [{ title: "Coûts bénéficiaire — AMO ID Admin" }];
}

export default function BeneficiaryCostsRoute({ loaderData }: Route.ComponentProps) {
  return <BeneficiaryCostsPage profile={loaderData.profile} />;
}

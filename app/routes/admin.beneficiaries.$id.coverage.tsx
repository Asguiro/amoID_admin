import { BeneficiaryCoveragePage } from "~/pages/beneficiaries/BeneficiariesPage";
import { loadBeneficiary } from "~/server/beneficiaries/beneficiary.loader.server";
import type { Route } from "./+types/admin.beneficiaries.$id.coverage";

export function loader({ request, params }: Route.LoaderArgs) { return loadBeneficiary(request, params.id); }
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <BeneficiaryCoveragePage beneficiary={loaderData.beneficiary} />;
}

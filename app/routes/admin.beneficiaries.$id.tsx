import { BeneficiaryDetailPage } from "~/pages/beneficiaries/BeneficiariesPage";
import { loadBeneficiary, revealBeneficiary } from "~/server/beneficiaries/beneficiary.loader.server";
import type { Route } from "./+types/admin.beneficiaries.$id";

export function loader({ request, params }: Route.LoaderArgs) { return loadBeneficiary(request, params.id); }
export function action({ request, params }: Route.ActionArgs) { return revealBeneficiary(request, params.id); }
export default function RouteComponent({ loaderData, actionData }: Route.ComponentProps) {
  return <BeneficiaryDetailPage beneficiary={loaderData.beneficiary} canReveal={loaderData.canReveal} sensitive={actionData?.sensitive} />;
}

import { BeneficiariesPage } from "~/pages/beneficiaries/BeneficiariesPage";
import { loadBeneficiaries } from "~/server/beneficiaries/beneficiary.loader.server";
import type { Route } from "./+types/admin.beneficiaries";

export function loader({ request }: Route.LoaderArgs) { return loadBeneficiaries(request); }
export function meta() { return [{ title: "Bénéficiaires — AMO ID Admin" }]; }
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <BeneficiariesPage result={loaderData.result} q={loaderData.query.q} />;
}

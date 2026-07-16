import { TemporaryQrListPage } from "~/pages/temporary-qr/TemporaryQrPage";
import { loadBeneficiaryQrs } from "~/server/beneficiaries/beneficiary.loader.server";
import type { Route } from "./+types/admin.beneficiaries.$id.temporary-qr";

export function loader({ request, params }: Route.LoaderArgs) { return loadBeneficiaryQrs(request, params.id); }
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <TemporaryQrListPage result={loaderData.result} beneficiaryId={loaderData.beneficiaryId} />;
}

import { TemporaryQrDetailPage } from "~/pages/temporary-qr/TemporaryQrPage";
import { loadTemporaryQr, revokeQr } from "~/server/temporary-qr/temporary-qr.loader.server";
import type { Route } from "./+types/admin.temporary-qr.$id";

export function loader({ request, params }: Route.LoaderArgs) { return loadTemporaryQr(request, params.id); }
export function action({ request, params }: Route.ActionArgs) { return revokeQr(request, params.id); }
export default function RouteComponent({ loaderData, actionData }: Route.ComponentProps) {
  return <TemporaryQrDetailPage {...loaderData} actionData={actionData} />;
}

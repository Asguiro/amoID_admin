import { TemporaryQrListPage } from "~/pages/temporary-qr/TemporaryQrPage";
import { loadTemporaryQrs } from "~/server/temporary-qr/temporary-qr.loader.server";
import type { Route } from "./+types/admin.temporary-qr";

export function loader({ request }: Route.LoaderArgs) { return loadTemporaryQrs(request); }
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <TemporaryQrListPage result={loaderData.result} q={loaderData.query.q} />;
}

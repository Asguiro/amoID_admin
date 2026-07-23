import { EstablishmentDetailPage } from "~/pages/establishments/EstablishmentDetailPage";
import {
  establishmentStatusAction,
  loadEstablishmentDetail,
} from "~/server/establishments/establishments.loader.server";
import type { Route } from "./+types/admin.establishments.$id";

export function loader({ request, params }: Route.LoaderArgs) {
  return loadEstablishmentDetail(request, params.id);
}
export function action({ request, params }: Route.ActionArgs) {
  return establishmentStatusAction(request, params.id);
}
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <EstablishmentDetailPage establishment={loaderData.establishment} />;
}

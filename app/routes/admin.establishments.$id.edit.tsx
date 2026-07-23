import { EstablishmentFormPage } from "~/pages/establishments/EstablishmentFormPage";
import {
  loadEstablishmentEdit,
  updateEstablishmentAction,
} from "~/server/establishments/establishments.loader.server";
import type { Route } from "./+types/admin.establishments.$id.edit";

export function loader({ request, params }: Route.LoaderArgs) {
  return loadEstablishmentEdit(request, params.id);
}
export function action({ request, params }: Route.ActionArgs) {
  return updateEstablishmentAction(request, params.id);
}
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return (
    <EstablishmentFormPage
      establishment={loaderData.establishment}
      regions={loaderData.regions}
    />
  );
}

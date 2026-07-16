import { EstablishmentFormPage } from "~/pages/establishments/EstablishmentFormPage";
import { createEstablishmentAction, loadEstablishmentCreate } from "~/server/establishments/establishments.loader.server";
import type { Route } from "./+types/admin.establishments.new";

export function loader({ request }: Route.LoaderArgs) {
  return loadEstablishmentCreate(request);
}
export function action({ request }: Route.ActionArgs) {
  return createEstablishmentAction(request);
}
export default function RouteComponent() {
  return <EstablishmentFormPage />;
}

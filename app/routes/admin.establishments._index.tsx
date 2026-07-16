import { EstablishmentsListPage } from "~/pages/establishments/EstablishmentsListPage";
import { loadEstablishmentsList } from "~/server/establishments/establishments.loader.server";
import type { Route } from "./+types/admin.establishments._index";

export function loader({ request }: Route.LoaderArgs) {
  return loadEstablishmentsList(request);
}

export function meta() {
  return [{ title: "Établissements — AMO ID Admin" }];
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <EstablishmentsListPage data={loaderData.establishments} query={loaderData.query} />;
}

import { UnauthorizedPage } from "~/pages/errors/UnauthorizedPage";

export function meta() {
  return [{ title: "Accès refusé — AMO ID Admin" }];
}

export default function UnauthorizedRoute() {
  return <UnauthorizedPage />;
}

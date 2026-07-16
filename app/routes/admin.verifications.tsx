import { VerificationsPage } from "~/pages/verifications/VerificationsPage";
import { loadVerifications } from "~/server/verifications/verification.loader.server";
import type { Route } from "./+types/admin.verifications";

export function loader({ request }: Route.LoaderArgs) {
  return loadVerifications(request);
}
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return (
    <VerificationsPage result={loaderData.result} query={loaderData.query} />
  );
}

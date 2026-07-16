import { VerificationDetailPage } from "~/pages/verifications/VerificationsPage";
import { loadVerification } from "~/server/verifications/verification.loader.server";
import type { Route } from "./+types/admin.verifications.$id";

export function loader({ request, params }: Route.LoaderArgs) { return loadVerification(request, params.id); }
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <VerificationDetailPage verification={loaderData.verification} />;
}

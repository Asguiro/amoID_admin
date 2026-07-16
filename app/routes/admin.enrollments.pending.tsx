import { EnrollmentsPage } from "~/pages/enrollments/EnrollmentsPage";
import { loadEnrollments } from "~/server/enrollments/enrollment.loader.server";
import type { Route } from "./+types/admin.enrollments.pending";

export function loader({ request }: Route.LoaderArgs) { return loadEnrollments(request, true); }
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <EnrollmentsPage result={loaderData.result} q={loaderData.query.q} pendingOnly />;
}

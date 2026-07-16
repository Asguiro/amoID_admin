import { EnrollmentsPage } from "~/pages/enrollments/EnrollmentsPage";
import { loadEnrollments } from "~/server/enrollments/enrollment.loader.server";
import type { Route } from "./+types/admin.enrollments";

export function loader({ request }: Route.LoaderArgs) { return loadEnrollments(request); }
export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  return <EnrollmentsPage result={loaderData.result} q={loaderData.query.q} />;
}

import { EnrollmentDetailPage } from "~/pages/enrollments/EnrollmentsPage";
import { loadEnrollment, mutateEnrollment } from "~/server/enrollments/enrollment.loader.server";
import type { Route } from "./+types/admin.enrollments.$id";

export function loader({ request, params }: Route.LoaderArgs) { return loadEnrollment(request, params.id); }
export function action({ request, params }: Route.ActionArgs) { return mutateEnrollment(request, params.id); }
export default function RouteComponent({ loaderData, actionData }: Route.ComponentProps) {
  return <EnrollmentDetailPage {...loaderData} actionData={actionData} />;
}

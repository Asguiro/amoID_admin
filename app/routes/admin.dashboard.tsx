import { isRouteErrorResponse, Link } from "react-router";

import { ErrorState } from "~/components/ui/ErrorState";
import { DashboardSkeleton } from "~/components/ui/LoadingState";
import { DashboardPage } from "~/pages/dashboard/DashboardPage";
import { loadDashboard } from "~/server/dashboard/dashboard.loader.server";
import type { Route } from "./+types/admin.dashboard";

export async function loader({ request }: Route.LoaderArgs) {
  return loadDashboard(request);
}

export function meta() {
  return [{ title: "Tableau de bord — AMO ID Admin" }];
}

export function HydrateFallback() {
  return <DashboardSkeleton />;
}

export default function DashboardRoute({
  loaderData,
}: Route.ComponentProps) {
  return <DashboardPage overview={loaderData.overview} />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Une erreur est survenue lors du chargement du tableau de bord.";
  let correlationId: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.data?.message ?? error.statusText ?? message;
    correlationId = error.data?.correlationId;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <ErrorState
      message={message}
      correlationId={correlationId}
      action={
        <Link to="/dashboard" className="btn btn-primary btn-sm">
          Réessayer
        </Link>
      }
    />
  );
}

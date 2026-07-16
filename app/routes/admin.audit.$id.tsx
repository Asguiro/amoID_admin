import { AuditDetailPage } from "~/pages/audit/AuditPages";
import { loadAuditDetail } from "~/server/audit/audit.loader.server";
import type { Route } from "./+types/admin.audit.$id";

export function loader({ request, params }: Route.LoaderArgs) {
  return loadAuditDetail(request, params.id);
}

export default function AuditDetailRoute({ loaderData }: Route.ComponentProps) {
  return <AuditDetailPage event={loaderData.event} />;
}

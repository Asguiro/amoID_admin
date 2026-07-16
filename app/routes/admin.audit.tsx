import { AuditListPage } from "~/pages/audit/AuditPages";
import { loadAuditList } from "~/server/audit/audit.loader.server";
import type { Route } from "./+types/admin.audit";

export function loader({ request }: Route.LoaderArgs) {
  return loadAuditList(request);
}

export function meta() {
  return [{ title: "Journal d’audit — AMO ID Admin" }];
}

export default function AuditRoute({ loaderData }: Route.ComponentProps) {
  return <AuditListPage result={loaderData.result} query={loaderData.query} />;
}

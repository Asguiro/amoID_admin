import { permissions } from "~/config/permissions";
import { getAuditEvent, listAuditEvents } from "~/services/audit/audit.service";
import { parseListSearchParams } from "~/utils/search-params";

import { requirePermission } from "../auth/require-permission.server";

export async function loadAuditList(request: Request) {
  await requirePermission(request, permissions.auditRead);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  return { result: await listAuditEvents(query), query };
}

export async function loadAuditDetail(request: Request, id: string) {
  await requirePermission(request, permissions.auditRead);
  const event = await getAuditEvent(id);
  if (!event) throw new Response("Événement d’audit introuvable.", { status: 404 });
  return { event };
}

import { permissions } from "~/config/permissions";
import { getAuditEvent, listAuditEvents } from "~/services/audit/audit.service";
import { parseListSearchParams } from "~/utils/search-params";

import { requirePermission } from "../auth/require-permission.server";
import { requireAccessToken } from "../session.server";

export async function loadAuditList(request: Request) {
  await requirePermission(request, permissions.auditRead);
  const accessToken = await requireAccessToken(request);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  return { result: await listAuditEvents(query, accessToken), query };
}

export async function loadAuditDetail(request: Request, id: string) {
  await requirePermission(request, permissions.auditRead);
  const accessToken = await requireAccessToken(request);
  const event = await getAuditEvent(id, accessToken);
  if (!event) throw new Response("Événement d’audit introuvable.", { status: 404 });
  return { event };
}

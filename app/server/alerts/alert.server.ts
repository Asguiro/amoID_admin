import { permissions } from "~/config/permissions";
import {
  addAlertComment,
  assignAlert,
  getAlertDetail,
  listAlerts,
  updateAlertStatus,
} from "~/services/alerts/alert.service";
import type { AlertStatus } from "~/types/admin";
import { parseListSearchParams } from "~/utils/search-params";

import { requirePermission } from "../auth/require-permission.server";
import { requireCsrfToken } from "../security/csrf.server";

const alertStatuses: AlertStatus[] = [
  "NEW",
  "ASSIGNED",
  "UNDER_REVIEW",
  "CONFIRMED",
  "DISMISSED",
  "ESCALATED",
  "CLOSED",
];

export async function loadAlertList(request: Request) {
  await requirePermission(request, permissions.alertRead);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  return { result: await listAlerts(query), query };
}

export async function loadAlertDetail(request: Request, id: string) {
  const user = await requirePermission(request, permissions.alertRead);
  const alert = await getAlertDetail(id);
  if (!alert) throw new Response("Alerte introuvable.", { status: 404 });
  return { alert, permissions: user.permissions };
}

export async function mutateAlert(request: Request, id: string) {
  await requireCsrfToken(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  try {
    if (intent === "assign") {
      await requirePermission(request, permissions.alertAssign);
      await assignAlert(id, String(formData.get("assignee") ?? ""));
    } else if (intent === "comment") {
      await requirePermission(request, permissions.alertInvestigate);
      await addAlertComment(id, String(formData.get("body") ?? ""));
    } else if (intent === "status") {
      const status = String(formData.get("status") ?? "") as AlertStatus;
      if (!alertStatuses.includes(status)) throw new Error("Statut d’alerte invalide.");
      await requirePermission(
        request,
        status === "UNDER_REVIEW"
          ? permissions.alertInvestigate
          : permissions.alertDecide,
      );
      await updateAlertStatus(
        id,
        status,
        String(formData.get("reason") ?? ""),
      );
    } else {
      throw new Error("Action d’alerte inconnue.");
    }
    return { ok: true as const };
  } catch (error) {
    if (error instanceof Response) throw error;
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Impossible de modifier l’alerte.",
    };
  }
}

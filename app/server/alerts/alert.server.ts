import { data } from "react-router";

import { permissions } from "~/config/permissions";
import { ALERT_DECISION_REASONS } from "~/config/reason-options";
import { listAgents } from "~/services/agents/agents.service";
import {
  addAlertComment,
  assignAlert,
  getAlertDetail,
  listAlerts,
  updateAlertStatus,
} from "~/services/alerts/alert.service";
import type { AlertStatus } from "~/types/admin";
import { composeReasonFromForm } from "~/utils/compose-reason";
import { parseListSearchParams } from "~/utils/search-params";

import { requirePermission } from "../auth/require-permission.server";
import { ApiClientError } from "../api/errors.server";
import { markAlertSeen } from "./seen-alerts.server";
import { requireCsrfToken } from "../security/csrf.server";
import { requireAccessToken } from "../session.server";

const alertStatuses: AlertStatus[] = [
  "NEW",
  "ASSIGNED",
  "UNDER_REVIEW",
  "NEEDS_INFORMATION",
  "CONFIRMED",
  "DISMISSED",
  "ESCALATED",
  "CLOSED",
];

function actionError(error: unknown, fallback: string) {
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export async function loadAlertList(request: Request) {
  await requirePermission(request, permissions.alertRead);
  const accessToken = await requireAccessToken(request);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  return { result: await listAlerts(query, accessToken), query };
}

export async function loadAlertDetail(request: Request, id: string) {
  const user = await requirePermission(request, permissions.alertRead);
  const accessToken = await requireAccessToken(request);
  const alert = await getAlertDetail(id, accessToken);
  if (!alert) throw new Response("Alerte introuvable.", { status: 404 });

  const canAssign = user.permissions.includes(permissions.alertAssign);
  let assignableAgents: Awaited<ReturnType<typeof listAgents>>["items"] = [];
  if (canAssign) {
    try {
      assignableAgents = (
        await listAgents(
          { page: 1, pageSize: 100, status: "ACTIVE" },
          accessToken,
        )
      ).items;
    } catch {
      assignableAgents = [];
    }
  }

  const seenCookie = await markAlertSeen(request, id);
  const payload = {
    alert,
    permissions: user.permissions,
    assignableAgents,
  };

  if (seenCookie) {
    return data(payload, { headers: { "Set-Cookie": seenCookie } });
  }
  return payload;
}

export async function mutateAlert(request: Request, id: string) {
  await requireCsrfToken(request);
  const accessToken = await requireAccessToken(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  try {
    const current = await getAlertDetail(id, accessToken);
    if (!current) throw new Response("Alerte introuvable.", { status: 404 });

    if (intent === "assign") {
      await requirePermission(request, permissions.alertAssign);
      if (current.status !== "NEW" && current.status !== "ASSIGNED") {
        return {
          ok: false as const,
          error: "Cette alerte ne peut plus être affectée dans cet état.",
        };
      }
      const assigneeId = String(formData.get("assigneeId") ?? "").trim();
      if (!assigneeId) {
        return {
          ok: false as const,
          error: "Sélectionnez un agent à affecter.",
        };
      }
      const alert = await assignAlert(id, assigneeId, accessToken);
      return {
        ok: true as const,
        alert,
        success: `Alerte affectée à ${alert.assignee ?? "l’agent sélectionné"}.`,
      };
    }

    if (intent === "comment") {
      await requirePermission(request, permissions.alertInvestigate);
      const alert = await addAlertComment(
        id,
        String(formData.get("body") ?? ""),
        accessToken,
      );
      return { ok: true as const, alert, success: "Commentaire ajouté." };
    }

    if (intent === "status") {
      const status = String(formData.get("status") ?? "") as AlertStatus;
      if (!alertStatuses.includes(status)) {
        return { ok: false as const, error: "Statut d’alerte invalide." };
      }
      await requirePermission(
        request,
        status === "UNDER_REVIEW" || status === "NEEDS_INFORMATION"
          ? permissions.alertInvestigate
          : permissions.alertDecide,
      );
      const composed = composeReasonFromForm(formData, ALERT_DECISION_REASONS);
      if (!composed.ok) return { ok: false as const, error: composed.error };
      const alert = await updateAlertStatus(
        id,
        status,
        composed.reason,
        accessToken,
      );
      return {
        ok: true as const,
        alert,
        success: "Décision enregistrée.",
      };
    }

    return { ok: false as const, error: "Action d’alerte inconnue." };
  } catch (error) {
    if (error instanceof Response) throw error;
    return {
      ok: false as const,
      error: actionError(error, "Impossible de modifier l’alerte."),
    };
  }
}

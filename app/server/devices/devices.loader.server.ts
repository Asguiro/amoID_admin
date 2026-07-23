import { permissions } from "~/config/permissions";
import {
  DEVICE_APPROVE_REASONS,
  DEVICE_REVOKE_REASONS,
} from "~/config/reason-options";
import { listAgents } from "~/services/agents/agents.service";
import {
  enrollDevice,
  getDevice,
  getDeviceStats,
  listDevices,
  listPendingSyncDevices,
  restoreDevice,
  revokeDevice,
  trustDevice,
} from "~/services/devices/devices.service";
import { composeReasonFromForm } from "~/utils/compose-reason";
import { parseListSearchParams } from "~/utils/search-params";

import { requirePermission } from "../auth/require-permission.server";
import { ApiClientError } from "../api/errors.server";
import { requireCsrfToken } from "../security/csrf.server";
import { requireAccessToken } from "../session.server";

function notFound(): never {
  throw new Response("Appareil introuvable", { status: 404 });
}

function actionError(error: unknown, fallback: string) {
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export async function loadDevicesList(request: Request) {
  await requirePermission(request, permissions.deviceRead);
  const accessToken = await requireAccessToken(request);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  const [devices, pendingSync, stats] = await Promise.all([
    listDevices(query, accessToken),
    listPendingSyncDevices(accessToken),
    getDeviceStats(accessToken),
  ]);
  return { devices, query, pendingSync, stats };
}

export async function loadDeviceCreate(request: Request) {
  await requirePermission(request, permissions.deviceTrust);
  const accessToken = await requireAccessToken(request);
  const url = new URL(request.url);
  const preselectedAgentId = url.searchParams.get("agentId") ?? undefined;
  const agents = await listAgents(
    { page: 1, pageSize: 100 },
    accessToken,
  );
  return { agents: agents.items, preselectedAgentId };
}

export async function createDeviceAction(request: Request) {
  await requireCsrfToken(request);
  await requirePermission(request, permissions.deviceTrust);
  const accessToken = await requireAccessToken(request);
  const formData = await request.formData();

  const deviceId = String(formData.get("deviceId") ?? "").trim();
  const agentId = String(formData.get("agentId") ?? "").trim();
  const platform = String(formData.get("platform") ?? "android").trim();
  const label = String(formData.get("label") ?? "").trim() || undefined;

  if (!deviceId || deviceId.length < 3) {
    return {
      error: "L’identifiant appareil est obligatoire (min. 3 caractères).",
    };
  }
  if (!agentId) {
    return { error: "Sélectionnez un agent." };
  }

  try {
    const device = await enrollDevice(
      { deviceId, agentId, platform, label },
      accessToken,
    );
    throw new Response(null, {
      status: 302,
      headers: { Location: `/devices/${device.id}` },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return {
      error: actionError(error, "Impossible d’enrôler l’appareil."),
    };
  }
}

export async function loadDeviceDetail(request: Request, id: string) {
  const user = await requirePermission(request, permissions.deviceRead);
  const accessToken = await requireAccessToken(request);
  const device = await getDevice(id, accessToken);
  if (!device) notFound();
  return {
    device,
    canTrust: user.permissions.includes(permissions.deviceTrust),
    canRevoke: user.permissions.includes(permissions.deviceRevoke),
    canRestore:
      user.role === "ADMIN_CENTRAL" &&
      user.permissions.includes(permissions.deviceRevoke),
  };
}

export async function mutateDeviceAction(request: Request, id: string) {
  await requireCsrfToken(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const accessToken = await requireAccessToken(request);

  try {
    const current = await getDevice(id, accessToken);
    if (!current) notFound();

    if (intent === "trust") {
      await requirePermission(request, permissions.deviceTrust);
      if (current.status !== "PENDING") {
        return {
          error: "Seuls les appareils en attente peuvent être approuvés.",
        };
      }
      const composed = composeReasonFromForm(formData, DEVICE_APPROVE_REASONS);
      if (!composed.ok) return { error: composed.error };
      const device = await trustDevice(id, composed.reason, accessToken);
      if (!device) notFound();
      return { device, success: "Appareil approuvé." };
    }

    if (intent === "restore") {
      const user = await requirePermission(request, permissions.deviceRevoke);
      if (user.role !== "ADMIN_CENTRAL") {
        return { error: "Seul l’admin central peut restaurer un appareil." };
      }
      if (current.status !== "REVOKED") {
        return { error: "Seuls les appareils révoqués peuvent être restaurés." };
      }
      const composed = composeReasonFromForm(formData, DEVICE_APPROVE_REASONS);
      if (!composed.ok) return { error: composed.error };
      const device = await restoreDevice(id, composed.reason, accessToken);
      if (!device) notFound();
      return {
        device,
        success:
          "Appareil restauré. L’agent doit se reconnecter sur ce terminal.",
      };
    }

    if (intent === "revoke") {
      await requirePermission(request, permissions.deviceRevoke);
      if (current.status === "REVOKED") {
        return { error: "Cet appareil est déjà révoqué." };
      }
      const composed = composeReasonFromForm(formData, DEVICE_REVOKE_REASONS);
      if (!composed.ok) return { error: composed.error };
      const device = await revokeDevice(id, composed.reason, accessToken);
      if (!device) notFound();
      return {
        device,
        success:
          "Appareil révoqué. Les sessions mobiles liées ont été invalidées.",
      };
    }

    return { error: "Action invalide." };
  } catch (error) {
    if (error instanceof Response) throw error;
    return {
      error: actionError(error, "Impossible de modifier l’appareil."),
    };
  }
}

/** @deprecated use mutateDeviceAction */
export const revokeDeviceAction = mutateDeviceAction;

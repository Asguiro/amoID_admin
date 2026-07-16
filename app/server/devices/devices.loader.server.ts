import { redirect } from "react-router";

import { permissions } from "~/config/permissions";
import {
  getDevice,
  listDevices,
  listPendingSyncDevices,
  revokeDevice,
  trustDevice,
} from "~/services/devices/devices.service";
import { parseListSearchParams } from "~/utils/search-params";

import { requirePermission } from "../auth/require-permission.server";
import { requireCsrfToken } from "../security/csrf.server";

function notFound(): never {
  throw new Response("Appareil introuvable", { status: 404 });
}

export async function loadDevicesList(request: Request) {
  await requirePermission(request, permissions.deviceRead);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  const [devices, pendingSync] = await Promise.all([
    listDevices(query),
    listPendingSyncDevices(),
  ]);
  return { devices, query, pendingSync };
}

export async function loadDeviceDetail(request: Request, id: string) {
  const user = await requirePermission(request, permissions.deviceRead);
  const device = await getDevice(id);
  if (!device) notFound();
  return {
    device,
    canTrust: user.permissions.includes(permissions.deviceTrust),
    canRevoke: user.permissions.includes(permissions.deviceRevoke),
  };
}

export async function mutateDeviceAction(request: Request, id: string) {
  await requireCsrfToken(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  if (intent === "trust") {
    await requirePermission(request, permissions.deviceTrust);
    try {
      const device = await trustDevice(id, reason);
      if (!device) notFound();
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Approbation impossible.",
      };
    }
    return redirect(`/devices/${id}`);
  }

  if (intent === "revoke") {
    await requirePermission(request, permissions.deviceRevoke);
    try {
      const device = await revokeDevice(id, reason);
      if (!device) notFound();
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Révocation impossible.",
      };
    }
    return redirect(`/devices/${id}`);
  }

  throw new Response("Action invalide", { status: 400 });
}

/** @deprecated use mutateDeviceAction */
export const revokeDeviceAction = mutateDeviceAction;

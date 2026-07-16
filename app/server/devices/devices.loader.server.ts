import { redirect } from "react-router";

import { permissions } from "~/config/permissions";
import { getDevice, listDevices, revokeDevice } from "~/services/devices/devices.service";
import { parseListSearchParams } from "~/utils/search-params";

import { requirePermission } from "../auth/require-permission.server";
import { requireCsrfToken } from "../security/csrf.server";

function notFound(): never {
  throw new Response("Appareil introuvable", { status: 404 });
}

export async function loadDevicesList(request: Request) {
  await requirePermission(request, permissions.deviceRead);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  return { devices: await listDevices(query), query };
}

export async function loadDeviceDetail(request: Request, id: string) {
  await requirePermission(request, permissions.deviceRead);
  const device = await getDevice(id);
  if (!device) notFound();
  return { device };
}

export async function revokeDeviceAction(request: Request, id: string) {
  await requireCsrfToken(request);
  await requirePermission(request, permissions.deviceRevoke);
  const formData = await request.formData();
  if (String(formData.get("intent")) !== "revoke") {
    throw new Response("Action invalide", { status: 400 });
  }
  const device = await revokeDevice(id, String(formData.get("reason") ?? "").trim());
  if (!device) notFound();
  return redirect(`/devices/${id}`);
}

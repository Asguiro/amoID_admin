import { permissions } from "~/config/permissions";
import { getTemporaryQr, listTemporaryQrs, revokeTemporaryQr } from "~/services/temporary-qr/temporary-qr.service";
import { parseListSearchParams } from "~/utils/search-params";

import { requirePermission } from "../auth/require-permission.server";
import { requireCsrfToken } from "../security/csrf.server";

export async function loadTemporaryQrs(request: Request) {
  await requirePermission(request, permissions.temporaryQrRead);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  return { result: await listTemporaryQrs(query), query };
}

export async function loadTemporaryQr(request: Request, id: string) {
  const user = await requirePermission(request, permissions.temporaryQrRead);
  const qr = await getTemporaryQr(id);
  if (!qr) throw new Response("QR temporaire introuvable", { status: 404 });
  return { qr, canRevoke: user.permissions.includes(permissions.temporaryQrRevoke) };
}

export async function revokeQr(request: Request, id: string) {
  await requireCsrfToken(request);
  await requirePermission(request, permissions.temporaryQrRevoke);
  const formData = await request.formData();
  const reason = String(formData.get("reason") ?? "").trim();
  if (!reason) return { error: "Le motif de révocation est obligatoire." };
  return { qr: await revokeTemporaryQr(id, reason), success: "QR temporaire révoqué." };
}

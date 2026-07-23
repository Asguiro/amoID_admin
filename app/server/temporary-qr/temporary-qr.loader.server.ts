import { permissions } from "~/config/permissions";
import { getTemporaryQr, listTemporaryQrs, revokeTemporaryQr } from "~/services/temporary-qr/temporary-qr.service";
import { parseListSearchParams } from "~/utils/search-params";

import { requirePermission } from "../auth/require-permission.server";
import { requireCsrfToken } from "../security/csrf.server";
import { requireAccessToken } from "../session.server";

export async function loadTemporaryQrs(request: Request) {
  await requirePermission(request, permissions.temporaryQrRead);
  const accessToken = await requireAccessToken(request);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  return { result: await listTemporaryQrs(query, accessToken), query };
}

export async function loadTemporaryQr(request: Request, id: string) {
  const user = await requirePermission(request, permissions.temporaryQrRead);
  const accessToken = await requireAccessToken(request);
  const qr = await getTemporaryQr(id, accessToken);
  if (!qr) throw new Response("QR temporaire introuvable", { status: 404 });
  return { qr, canRevoke: user.permissions.includes(permissions.temporaryQrRevoke) };
}

export async function revokeQr(request: Request, id: string) {
  await requireCsrfToken(request);
  await requirePermission(request, permissions.temporaryQrRevoke);
  const accessToken = await requireAccessToken(request);
  const formData = await request.formData();
  const reason = String(formData.get("reason") ?? "").trim();
  if (!reason) return { error: "Le motif de révocation est obligatoire." };
  return {
    qr: await revokeTemporaryQr(id, reason, accessToken),
    success: "QR temporaire révoqué.",
  };
}

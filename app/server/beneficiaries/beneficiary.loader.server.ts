import { hasPermission, permissions } from "~/config/permissions";
import { getBeneficiaryDetail, listBeneficiaries, revealSensitive } from "~/services/beneficiaries/beneficiary.service";
import { listTemporaryQrs } from "~/services/temporary-qr/temporary-qr.service";
import { parseListSearchParams } from "~/utils/search-params";

import { requirePermission } from "../auth/require-permission.server";
import { requireCsrfToken } from "../security/csrf.server";

export async function loadBeneficiaries(request: Request) {
  await requirePermission(request, permissions.beneficiaryReadBasic);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  return { result: await listBeneficiaries(query), query };
}

export async function loadBeneficiary(request: Request, id: string) {
  const user = await requirePermission(request, permissions.beneficiaryReadBasic);
  const beneficiary = await getBeneficiaryDetail(id);
  if (!beneficiary) throw new Response("Bénéficiaire introuvable", { status: 404 });
  return {
    beneficiary,
    canReveal: hasPermission(user.permissions, permissions.beneficiaryReadSensitive),
    canReadHealth: hasPermission(user.permissions, permissions.beneficiaryReadHealth),
  };
}

export async function revealBeneficiary(request: Request, id: string) {
  await requireCsrfToken(request);
  await requirePermission(request, permissions.beneficiaryReadSensitive);
  const formData = await request.formData();
  if (formData.get("intent") !== "reveal") throw new Response("Action invalide", { status: 400 });
  const sensitive = await revealSensitive(id);
  if (!sensitive) throw new Response("Bénéficiaire introuvable", { status: 404 });
  return { sensitive };
}

export async function loadBeneficiaryQrs(request: Request, id: string) {
  await requirePermission(request, permissions.temporaryQrRead);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  return { result: await listTemporaryQrs({ ...query, beneficiaryId: id }), beneficiaryId: id };
}

import { permissions } from "~/config/permissions";
import { getVerification, listVerifications } from "~/services/verifications/verification.service";
import { parseListSearchParams } from "~/utils/search-params";

import { requirePermission } from "../auth/require-permission.server";

export async function loadVerifications(request: Request) {
  await requirePermission(request, permissions.verificationRead);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  return { result: await listVerifications(query), query };
}

export async function loadVerification(request: Request, id: string) {
  await requirePermission(request, permissions.verificationRead);
  const verification = await getVerification(id);
  if (!verification) throw new Response("Vérification introuvable", { status: 404 });
  return { verification };
}

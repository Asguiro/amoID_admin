import { permissions } from "~/config/permissions";
import { getVerification, listVerifications } from "~/services/verifications/verification.service";
import { parseListSearchParams } from "~/utils/search-params";

import { requirePermission } from "../auth/require-permission.server";
import { requireAccessToken } from "../session.server";

export async function loadVerifications(request: Request) {
  await requirePermission(request, permissions.verificationRead);
  const accessToken = await requireAccessToken(request);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  return { result: await listVerifications(query, accessToken), query };
}

export async function loadVerification(request: Request, id: string) {
  await requirePermission(request, permissions.verificationRead);
  const accessToken = await requireAccessToken(request);
  const verification = await getVerification(id, accessToken);
  if (!verification) throw new Response("Vérification introuvable", { status: 404 });
  return { verification };
}

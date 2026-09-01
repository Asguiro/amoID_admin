import { permissions } from "~/config/permissions";
import { hasAnyPermission } from "~/config/permissions";
import { getServerEnv } from "~/server/env.server";
import { requireAuth } from "~/server/auth/require-auth.server";
import { requireAccessToken } from "~/server/session.server";

import type { Route } from "./+types/admin.beneficiaries.$id.face-preview";

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  if (
    !hasAnyPermission(user.permissions, [permissions.beneficiaryReadBasic])
  ) {
    throw new Response("Non autorisé.", { status: 403 });
  }
  const accessToken = await requireAccessToken(request);
  const env = getServerEnv();

  const response = await fetch(
    new URL(`/admin/beneficiaries/${params.id}/face-preview`, env.API_URL),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "image/*",
      },
    },
  );

  if (!response.ok) {
    throw new Response("Capture faciale indisponible.", {
      status: response.status === 404 ? 404 : 502,
    });
  }

  const contentType = response.headers.get("Content-Type") ?? "image/jpeg";
  const body = await response.arrayBuffer();

  return new Response(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=60",
    },
  });
}

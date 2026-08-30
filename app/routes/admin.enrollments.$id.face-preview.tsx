import { permissions } from "~/config/permissions";
import { getServerEnv } from "~/server/env.server";
import { requirePermission } from "~/server/auth/require-permission.server";
import { requireAccessToken } from "~/server/session.server";

import type { Route } from "./+types/admin.enrollments.$id.face-preview";

export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePermission(request, permissions.enrollmentValidate);
  const accessToken = await requireAccessToken(request);
  const env = getServerEnv();

  const response = await fetch(
    new URL(`/admin/enrollments/${params.id}/face-preview`, env.API_URL),
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

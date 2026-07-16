import { data } from "react-router";

import { AdminShell } from "~/components/layouts/AdminShell";
import { requireAuth } from "~/server/auth/require-auth.server";
import { ensureCsrfToken } from "~/server/security/csrf.server";
import type { Route } from "./+types/admin";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  const { token, setCookieHeader } = await ensureCsrfToken(request);

  return data(
    { user, csrfToken: token },
    setCookieHeader
      ? { headers: { "Set-Cookie": setCookieHeader } }
      : undefined,
  );
}

export default function AdminLayoutRoute({
  loaderData,
}: Route.ComponentProps) {
  return (
    <AdminShell user={loaderData.user} csrfToken={loaderData.csrfToken} />
  );
}

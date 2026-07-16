import type { Route } from "./+types/logout";
import { requireCsrfToken } from "~/server/security/csrf.server";
import { destroyUserSession } from "~/server/session.server";

export async function action({ request }: Route.ActionArgs) {
  await requireCsrfToken(request);
  return destroyUserSession(request);
}

export async function loader({ request }: Route.LoaderArgs) {
  return destroyUserSession(request);
}

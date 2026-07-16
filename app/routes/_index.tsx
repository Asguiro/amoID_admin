import { redirect } from "react-router";

import { getUserFromRequest } from "~/server/session.server";
import type { Route } from "./+types/_index";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUserFromRequest(request);
  throw redirect(user ? "/dashboard" : "/login");
}

export default function IndexRoute() {
  return null;
}

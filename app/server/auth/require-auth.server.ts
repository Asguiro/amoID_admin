import { redirect } from "react-router";

import type { AdminSessionUser } from "~/types/admin";

import { getUserFromRequest } from "../session.server";

export async function requireAuth(
  request: Request,
): Promise<AdminSessionUser> {
  const user = await getUserFromRequest(request);
  if (!user) {
    const url = new URL(request.url);
    const redirectTo = `${url.pathname}${url.search}`;
    throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }
  return user;
}

import {
  authenticateUser,
  getDemoAccounts,
} from "~/services/auth/auth.service";
import type { AdminSessionUser } from "~/types/admin";

import { createUserSession, getUserFromRequest } from "../session.server";

export async function loginAction(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/dashboard");

  const result = await authenticateUser({ email, password });
  if (!result.ok) {
    return {
      ok: false as const,
      error: result.message,
      demoAccounts: getDemoAccounts(),
    };
  }

  const safeRedirect =
    redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/dashboard";

  return createUserSession(result.user, safeRedirect, {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
}

export async function loginLoader(request: Request) {
  const user = await getUserFromRequest(request);
  return {
    user,
    demoAccounts: getDemoAccounts(),
  };
}

export type { AdminSessionUser };

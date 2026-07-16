import { redirect } from "react-router";

import type { Permission } from "~/config/permissions";
import { userHasAnyPermission, userHasPermission } from "~/services/permissions/permission.service";
import type { AdminSessionUser } from "~/types/admin";

import { requireAuth } from "./require-auth.server";

export async function requirePermission(
  request: Request,
  permission: Permission,
): Promise<AdminSessionUser> {
  const user = await requireAuth(request);
  if (!userHasPermission(user, permission)) {
    throw redirect("/unauthorized");
  }
  return user;
}

export async function requireAnyPermission(
  request: Request,
  permissions: readonly Permission[],
): Promise<AdminSessionUser> {
  const user = await requireAuth(request);
  if (!userHasAnyPermission(user, permissions)) {
    throw redirect("/unauthorized");
  }
  return user;
}

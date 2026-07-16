import { hasAnyPermission, hasPermission, type Permission } from "~/config/permissions";
import type { AdminSessionUser } from "~/types/admin";

export function userHasPermission(
  user: AdminSessionUser,
  permission: Permission,
): boolean {
  return hasPermission(user.permissions, permission);
}

export function userHasAnyPermission(
  user: AdminSessionUser,
  required: readonly Permission[],
): boolean {
  return hasAnyPermission(user.permissions, required);
}

import { describe, expect, it } from "vitest";

import { permissions } from "~/config/permissions";
import {
  userHasAnyPermission,
  userHasPermission,
} from "~/services/permissions/permission.service";
import type { AdminSessionUser } from "~/types/admin";

const user: AdminSessionUser = {
  id: "1",
  displayName: "Test",
  email: "test@amo.ml",
  role: "REGIONAL_SUPERVISOR",
  permissions: [permissions.agentRead, permissions.alertRead],
};

describe("permission.service", () => {
  it("checks a single permission", () => {
    expect(userHasPermission(user, permissions.agentRead)).toBe(true);
    expect(userHasPermission(user, permissions.agentCreate)).toBe(false);
  });

  it("checks any permission", () => {
    expect(
      userHasAnyPermission(user, [
        permissions.agentCreate,
        permissions.alertRead,
      ]),
    ).toBe(true);
    expect(
      userHasAnyPermission(user, [
        permissions.agentCreate,
        permissions.settingsUpdate,
      ]),
    ).toBe(false);
  });
});

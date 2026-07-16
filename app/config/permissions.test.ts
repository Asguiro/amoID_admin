import { describe, expect, it } from "vitest";

import { hasAnyPermission, hasPermission, permissions } from "~/config/permissions";

describe("hasPermission", () => {
  it("returns true when permission is present", () => {
    expect(
      hasPermission(
        [permissions.dashboardReadGlobal],
        permissions.dashboardReadGlobal,
      ),
    ).toBe(true);
  });

  it("returns false when permission is missing", () => {
    expect(
      hasPermission([permissions.agentRead], permissions.dashboardReadGlobal),
    ).toBe(false);
  });
});

describe("hasAnyPermission", () => {
  it("returns true if any required permission matches", () => {
    expect(
      hasAnyPermission(
        [permissions.dashboardReadRegion],
        [
          permissions.dashboardReadGlobal,
          permissions.dashboardReadRegion,
        ],
      ),
    ).toBe(true);
  });

  it("returns false when none match", () => {
    expect(
      hasAnyPermission([permissions.auditRead], [
        permissions.dashboardReadGlobal,
      ]),
    ).toBe(false);
  });
});

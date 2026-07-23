import { beforeEach, describe, expect, it, vi } from "vitest";

import { authenticateUser } from "~/services/auth/auth.service";
import { getDashboardOverview } from "~/services/dashboard/dashboard.service";
import { adminRoles, permissions } from "~/config/permissions";
import { ApiClientError } from "~/server/api/errors.server";

vi.mock("~/server/api/client.server", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "~/server/api/client.server";

const apiRequestMock = vi.mocked(apiRequest);

describe("authenticateUser", () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
  });

  it("authenticates via API", async () => {
    apiRequestMock.mockResolvedValueOnce({
      accessToken: "access",
      refreshToken: "refresh",
      expiresIn: "15m",
      user: {
        id: "seed-agent-admin",
        displayName: "Admin Central",
        email: "admin@amo-id.ml",
        role: adminRoles.ADMIN_CENTRAL,
        permissions: [permissions.dashboardReadGlobal],
      },
    });

    const result = await authenticateUser({
      email: "admin@amo-id.ml",
      password: "Demo@2026!",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.user.role).toBe(adminRoles.ADMIN_CENTRAL);
      expect(result.accessToken).toBe("access");
      expect(result.user.permissions).toContain(permissions.dashboardReadGlobal);
    }
  });

  it("rejects invalid credentials", async () => {
    apiRequestMock.mockRejectedValueOnce(
      new ApiClientError(401, {
        code: "INVALID_CREDENTIALS",
        message: "Identifiants invalides.",
        correlationId: "test",
      }),
    );

    const result = await authenticateUser({
      email: "admin@amo-id.ml",
      password: "wrong",
    });

    expect(result.ok).toBe(false);
  });
});

describe("getDashboardOverview", () => {
  it("scales KPIs by period", async () => {
    const user = {
      id: "1",
      displayName: "Test",
      email: "test@amo.ml",
      role: adminRoles.ADMIN_CENTRAL,
      permissions: [permissions.dashboardReadGlobal],
    };

    const week = await getDashboardOverview({ user, period: "7d" });
    const month = await getDashboardOverview({ user, period: "30d" });

    expect(week.period).toBe("7d");
    expect(month.kpis[0]?.value).toBeGreaterThan(week.kpis[0]?.value ?? 0);
    expect(week.series).toHaveLength(7);
    expect(month.series).toHaveLength(14);
    expect(
      week.kpis.find((kpi) => kpi.id === "alerts_critical")?.trendIntent,
    ).toBe("negative");
    expect(
      week.kpis.find((kpi) => kpi.id === "incomplete_dossiers")?.trendIntent,
    ).toBe("positive");
  });

  it("returns empty dashboard collections when requested", async () => {
    const user = {
      id: "1",
      displayName: "Test",
      email: "test@amo.ml",
      role: adminRoles.ADMIN_CENTRAL,
      permissions: [permissions.dashboardReadGlobal],
    };

    const overview = await getDashboardOverview({
      user,
      period: "90d",
      empty: true,
    });

    expect(overview).toMatchObject({
      empty: true,
      kpis: [],
      priorityAlerts: [],
      recentActivity: [],
      series: [],
    });
  });
});

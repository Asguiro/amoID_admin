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
  beforeEach(() => {
    apiRequestMock.mockReset();
  });

  it("compose summary, trends et alerts API", async () => {
    const user = {
      id: "1",
      displayName: "Test",
      email: "test@amo.ml",
      role: adminRoles.ADMIN_CENTRAL,
      permissions: [permissions.dashboardReadGlobal],
    };

    apiRequestMock
      .mockResolvedValueOnce({
        generatedAt: "2026-07-23T00:00:00.000Z",
        kpis: [
          {
            id: "beneficiaries",
            label: "Bénéficiaires",
            value: 10,
            trendPercent: 0,
            trendIntent: "neutral",
          },
        ],
      })
      .mockResolvedValueOnce({
        generatedAt: "2026-07-23T00:00:00.000Z",
        points: [
          { date: "2026-07-22", verifications: 3 },
          { date: "2026-07-23", verifications: 5 },
        ],
      })
      .mockResolvedValueOnce({
        items: [
          {
            id: "a1",
            title: "Alerte",
            severity: "HIGH",
            status: "NEW",
            createdAt: "2026-07-23T00:00:00.000Z",
          },
        ],
      });

    const overview = await getDashboardOverview({
      user,
      period: "7d",
      accessToken: "token",
    });

    expect(overview.period).toBe("7d");
    expect(overview.kpis).toHaveLength(1);
    expect(overview.series).toHaveLength(2);
    expect(overview.priorityAlerts).toHaveLength(1);
    expect(apiRequestMock).toHaveBeenCalledWith(
      "/admin/dashboard/summary",
      expect.objectContaining({ accessToken: "token" }),
    );
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
      accessToken: "token",
    });

    expect(overview).toMatchObject({
      empty: true,
      kpis: [],
      priorityAlerts: [],
      recentActivity: [],
      series: [],
    });
    expect(apiRequestMock).not.toHaveBeenCalled();
  });
});

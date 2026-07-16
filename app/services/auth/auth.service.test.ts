import { describe, expect, it } from "vitest";

import { authenticateUser } from "~/services/auth/auth.service";
import { getDashboardOverview } from "~/services/dashboard/dashboard.service";
import { adminRoles, permissions } from "~/config/permissions";

describe("authenticateUser", () => {
  it("authenticates the demo admin", async () => {
    const result = await authenticateUser({
      email: "admin@amo.ml",
      password: "Admin123!",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.user.role).toBe(adminRoles.ADMIN_CENTRAL);
      expect(result.user.permissions).toContain(permissions.dashboardReadGlobal);
    }
  });

  it("rejects invalid credentials", async () => {
    const result = await authenticateUser({
      email: "admin@amo.ml",
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

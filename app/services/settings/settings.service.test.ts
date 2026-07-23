import { describe, expect, it, vi, beforeEach } from "vitest";

import { permissions } from "~/config/permissions";
import { trustDevice } from "~/services/devices/devices.service";
import {
  getAppSettings,
  listFraudRules,
  updateAppSettings,
  updateFraudRule,
} from "~/services/settings/settings.service";

vi.mock("~/server/api/client.server", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "~/server/api/client.server";

const apiRequestMock = vi.mocked(apiRequest);

describe("new permissions", () => {
  it("exposes enrollment.reject and device.trust", () => {
    expect(permissions.enrollmentReject).toBe("enrollment.reject");
    expect(permissions.deviceTrust).toBe("device.trust");
    expect(permissions.beneficiaryReadHealth).toBe("beneficiary.read.health");
  });
});

describe("devices.trust", () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
  });

  it("appelle restore avec le motif", async () => {
    apiRequestMock.mockResolvedValueOnce({
      id: "dev-003",
      label: "iPhone",
      status: "TRUSTED",
      agentId: "agt-1",
      agentName: "Agent",
      establishmentName: "CSRef",
      platform: "iOS",
      lastSeenAt: null,
      enrolledAt: new Date().toISOString(),
    });

    const result = await trustDevice("dev-003", "Contrôle terrain OK", "token");
    expect(result?.status).toBe("TRUSTED");
    expect(apiRequestMock).toHaveBeenCalledWith(
      "/admin/devices/dev-003/restore",
      expect.objectContaining({
        method: "POST",
        accessToken: "token",
        body: { reason: "Contrôle terrain OK" },
      }),
    );
  });

  it("refuse sans motif", async () => {
    await expect(trustDevice("dev-011", "  ", "token")).rejects.toThrow(
      "Le motif d’approbation est obligatoire.",
    );
  });
});

describe("settings.service", () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
  });

  it("met à jour les paramètres opérationnels", async () => {
    apiRequestMock
      .mockResolvedValueOnce({
        items: [
          { key: "ops.maxFaceAttempts", value: 3 },
          { key: "ops.maxQrDuration", value: "7D" },
          { key: "ops.auditRetentionDays", value: 365 },
        ],
      })
      .mockResolvedValueOnce({ key: "ops.maxFaceAttempts", value: 5 });

    const updated = await updateAppSettings({ maxFaceAttempts: 5 }, "token");
    expect(updated.maxFaceAttempts).toBe(5);
    expect(apiRequestMock).toHaveBeenCalledWith(
      "/admin/settings/ops.maxFaceAttempts",
      expect.objectContaining({
        method: "PATCH",
        accessToken: "token",
        body: { value: 5 },
      }),
    );
  });

  it("met à jour une règle de fraude", async () => {
    const rule = await updateFraudRule("rule_qr_abuse", {
      threshold: 8,
      enabled: false,
    });
    expect(rule.threshold).toBe(8);
    expect(rule.enabled).toBe(false);
    const listed = await listFraudRules();
    expect(listed.find((item) => item.id === "rule_qr_abuse")?.enabled).toBe(
      false,
    );
  });

  it("lit les paramètres via API", async () => {
    apiRequestMock.mockResolvedValueOnce({
      items: [{ key: "ops.maxFaceAttempts", value: 4 }],
    });
    const settings = await getAppSettings("token");
    expect(settings.maxFaceAttempts).toBe(4);
    expect(apiRequestMock).toHaveBeenCalledWith(
      "/admin/settings",
      expect.objectContaining({ accessToken: "token" }),
    );
  });
});

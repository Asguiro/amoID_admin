import { beforeEach, describe, expect, it } from "vitest";

import { permissions } from "~/config/permissions";
import {
  getDevice,
  resetDevicesForTests,
  trustDevice,
} from "~/services/devices/devices.service";
import {
  getAppSettings,
  listFraudRules,
  updateAppSettings,
  updateFraudRule,
} from "~/services/settings/settings.service";

describe("new permissions", () => {
  it("exposes enrollment.reject and device.trust", () => {
    expect(permissions.enrollmentReject).toBe("enrollment.reject");
    expect(permissions.deviceTrust).toBe("device.trust");
    expect(permissions.beneficiaryReadHealth).toBe("beneficiary.read.health");
  });
});

describe("devices.trust", () => {
  beforeEach(() => resetDevicesForTests());

  it("approuve un appareil en attente", async () => {
    const result = await trustDevice("dev-003", "Contrôle terrain OK");
    expect(result?.status).toBe("TRUSTED");
    expect((await getDevice("dev-003"))?.status).toBe("TRUSTED");
  });

  it("refuse sans motif", async () => {
    await expect(trustDevice("dev-011", "  ")).rejects.toThrow(
      "Le motif d’approbation est obligatoire.",
    );
  });
});

describe("settings.service", () => {
  it("met à jour les paramètres opérationnels", async () => {
    const updated = await updateAppSettings({ maxFaceAttempts: 5 });
    expect(updated.maxFaceAttempts).toBe(5);
    expect((await getAppSettings()).maxFaceAttempts).toBe(5);
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
});

import { apiRequest } from "~/server/api/client.server";
import type { AppSettings, FraudRule, TemporaryQrDuration } from "~/types/admin";

type SettingRow = { id?: string; key: string; value: unknown };

const DEFAULT_SETTINGS: AppSettings = {
  maxQrDuration: "7D",
  maxFaceAttempts: 3,
  auditRetentionDays: 365,
  fraudMultiMatchThreshold: 3,
  fraudQrAbusePerDay: 5,
  fraudSyncBlockedHours: 24,
};

const SETTING_KEYS = {
  maxQrDuration: "ops.maxQrDuration",
  maxFaceAttempts: "ops.maxFaceAttempts",
  auditRetentionDays: "ops.auditRetentionDays",
  fraudMultiMatchThreshold: "fraud.multiMatchThreshold",
  fraudQrAbusePerDay: "fraud.qrAbusePerDay",
  fraudSyncBlockedHours: "offline.syncMaxAgeHours",
} as const;

/** DEMO fraud-rule catalog — no dedicated admin API yet. */
let fraudRules: FraudRule[] = [
  {
    id: "rule_multi_match",
    name: "Multi-correspondances biométriques",
    description: "Alerte si plusieurs dossiers matchent la même capture.",
    threshold: 3,
    unit: "matches",
    enabled: true,
  },
  {
    id: "rule_qr_abuse",
    name: "Abus de QR temporaires",
    description: "Volume inhabituel d’émissions QR par agent / jour.",
    threshold: 5,
    unit: "qr/jour",
    enabled: true,
  },
  {
    id: "rule_sync_blocked",
    name: "Sync offline bloquée",
    description: "Appareil avec file de sync non résolue.",
    threshold: 24,
    unit: "heures",
    enabled: true,
  },
  {
    id: "rule_revoked_device",
    name: "Appareil révoqué réutilisé",
    description: "Tentative d’usage d’un terminal révoqué.",
    threshold: 1,
    unit: "tentative",
    enabled: true,
  },
];

function asNumber(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asDuration(value: unknown, fallback: TemporaryQrDuration): TemporaryQrDuration {
  if (value === "24H" || value === "72H" || value === "7D") return value;
  const minutes = asNumber(value, NaN);
  if (!Number.isFinite(minutes)) return fallback;
  if (minutes <= 60 * 24) return "24H";
  if (minutes <= 60 * 72) return "72H";
  return "7D";
}

function settingsFromRows(rows: SettingRow[]): AppSettings {
  const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  return {
    maxQrDuration: asDuration(
      map[SETTING_KEYS.maxQrDuration] ?? map["temporaryQr.ttlMinutes"],
      DEFAULT_SETTINGS.maxQrDuration,
    ),
    maxFaceAttempts: asNumber(
      map[SETTING_KEYS.maxFaceAttempts],
      DEFAULT_SETTINGS.maxFaceAttempts,
    ),
    auditRetentionDays: asNumber(
      map[SETTING_KEYS.auditRetentionDays],
      DEFAULT_SETTINGS.auditRetentionDays,
    ),
    fraudMultiMatchThreshold: asNumber(
      map[SETTING_KEYS.fraudMultiMatchThreshold],
      DEFAULT_SETTINGS.fraudMultiMatchThreshold,
    ),
    fraudQrAbusePerDay: asNumber(
      map[SETTING_KEYS.fraudQrAbusePerDay],
      DEFAULT_SETTINGS.fraudQrAbusePerDay,
    ),
    fraudSyncBlockedHours: asNumber(
      map[SETTING_KEYS.fraudSyncBlockedHours],
      DEFAULT_SETTINGS.fraudSyncBlockedHours,
    ),
  };
}

async function patchSetting(
  key: string,
  value: unknown,
  accessToken: string,
): Promise<void> {
  await apiRequest<SettingRow>(`/admin/settings/${encodeURIComponent(key)}`, {
    method: "PATCH",
    accessToken,
    body: { value },
  });
}

export async function getAppSettings(accessToken: string): Promise<AppSettings> {
  const res = await apiRequest<{ items: SettingRow[] }>("/admin/settings", {
    accessToken,
  });
  return settingsFromRows(res.items ?? []);
}

export async function updateAppSettings(
  patch: Partial<AppSettings>,
  accessToken: string,
): Promise<AppSettings> {
  const current = await getAppSettings(accessToken);
  const next = { ...current, ...patch };

  const writes: Array<Promise<void>> = [];
  if (patch.maxQrDuration !== undefined) {
    writes.push(
      patchSetting(SETTING_KEYS.maxQrDuration, next.maxQrDuration, accessToken),
    );
  }
  if (patch.maxFaceAttempts !== undefined) {
    writes.push(
      patchSetting(SETTING_KEYS.maxFaceAttempts, next.maxFaceAttempts, accessToken),
    );
  }
  if (patch.auditRetentionDays !== undefined) {
    writes.push(
      patchSetting(
        SETTING_KEYS.auditRetentionDays,
        next.auditRetentionDays,
        accessToken,
      ),
    );
  }
  if (patch.fraudMultiMatchThreshold !== undefined) {
    writes.push(
      patchSetting(
        SETTING_KEYS.fraudMultiMatchThreshold,
        next.fraudMultiMatchThreshold,
        accessToken,
      ),
    );
  }
  if (patch.fraudQrAbusePerDay !== undefined) {
    writes.push(
      patchSetting(
        SETTING_KEYS.fraudQrAbusePerDay,
        next.fraudQrAbusePerDay,
        accessToken,
      ),
    );
  }
  if (patch.fraudSyncBlockedHours !== undefined) {
    writes.push(
      patchSetting(
        SETTING_KEYS.fraudSyncBlockedHours,
        next.fraudSyncBlockedHours,
        accessToken,
      ),
    );
  }
  await Promise.all(writes);
  return next;
}

export async function listFraudRules(accessToken?: string): Promise<FraudRule[]> {
  if (accessToken) {
    try {
      const settings = await getAppSettings(accessToken);
      fraudRules = fraudRules.map((rule) => {
        if (rule.id === "rule_multi_match") {
          return { ...rule, threshold: settings.fraudMultiMatchThreshold };
        }
        if (rule.id === "rule_qr_abuse") {
          return { ...rule, threshold: settings.fraudQrAbusePerDay };
        }
        if (rule.id === "rule_sync_blocked") {
          return { ...rule, threshold: settings.fraudSyncBlockedHours };
        }
        return { ...rule };
      });
    } catch {
      // keep in-memory DEMO catalog
    }
  }
  return fraudRules.map((rule) => ({ ...rule }));
}

export async function updateFraudRule(
  id: string,
  patch: Partial<Pick<FraudRule, "threshold" | "enabled">>,
  accessToken?: string,
): Promise<FraudRule> {
  const index = fraudRules.findIndex((rule) => rule.id === id);
  if (index < 0) throw new Error("Règle introuvable.");
  const updated = { ...fraudRules[index]!, ...patch };
  fraudRules[index] = updated;

  if (accessToken && patch.threshold !== undefined) {
    if (id === "rule_multi_match") {
      await updateAppSettings(
        { fraudMultiMatchThreshold: patch.threshold },
        accessToken,
      );
    } else if (id === "rule_qr_abuse") {
      await updateAppSettings({ fraudQrAbusePerDay: patch.threshold }, accessToken);
    } else if (id === "rule_sync_blocked") {
      await updateAppSettings(
        { fraudSyncBlockedHours: patch.threshold },
        accessToken,
      );
    }
  }

  return { ...updated };
}

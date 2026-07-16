import type {
  AppSettings,
  FraudRule,
} from "~/types/admin";

let settings: AppSettings = {
  maxQrDuration: "7D",
  maxFaceAttempts: 3,
  auditRetentionDays: 365,
  fraudMultiMatchThreshold: 3,
  fraudQrAbusePerDay: 5,
  fraudSyncBlockedHours: 24,
};

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

export async function getAppSettings(): Promise<AppSettings> {
  return { ...settings };
}

export async function updateAppSettings(
  patch: Partial<AppSettings>,
): Promise<AppSettings> {
  settings = { ...settings, ...patch };
  return { ...settings };
}

export async function listFraudRules(): Promise<FraudRule[]> {
  return fraudRules.map((rule) => ({ ...rule }));
}

export async function updateFraudRule(
  id: string,
  patch: Partial<Pick<FraudRule, "threshold" | "enabled">>,
): Promise<FraudRule> {
  const index = fraudRules.findIndex((rule) => rule.id === id);
  if (index < 0) throw new Error("Règle introuvable.");
  const updated = { ...fraudRules[index]!, ...patch };
  fraudRules[index] = updated;
  return { ...updated };
}

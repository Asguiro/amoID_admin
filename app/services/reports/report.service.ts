import type { ExportJob, ReportSummary } from "~/types/admin";

export interface ReportKpi {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trendPercent: number;
}

export interface ReportData {
  id: string;
  title: string;
  description: string;
  generatedAt: string;
  kpis: ReportKpi[];
  highlights: Array<{ label: string; value: string }>;
}

const reports: ReportSummary[] = [
  {
    id: "operations",
    title: "Activité opérationnelle",
    description: "Enrôlements, vérifications et activité des établissements.",
    href: "/reports/operations",
  },
  {
    id: "biometrics",
    title: "Performance biométrique",
    description: "Taux de réussite et principaux motifs d’échec.",
    href: "/reports/biometrics",
  },
  {
    id: "temporary-qr",
    title: "QR temporaires",
    description: "Émissions, utilisations, expirations et révocations.",
    href: "/reports/temporary-qr",
  },
  {
    id: "fraud",
    title: "Alertes et fraude",
    description: "Signaux détectés, décisions et délais de traitement.",
    href: "/reports/fraud",
  },
];

const exportJobs = new Map<string, ExportJob>();

function report(
  id: string,
  title: string,
  description: string,
  kpis: ReportKpi[],
  highlights: ReportData["highlights"],
): ReportData {
  return { id, title, description, kpis, highlights, generatedAt: new Date().toISOString() };
}

export async function listReports(): Promise<ReportSummary[]> {
  return reports;
}

export async function getOperationsReport(): Promise<ReportData> {
  return report(
    "operations",
    "Activité opérationnelle",
    "Vue consolidée des opérations des 30 derniers jours.",
    [
      { id: "enrollments", label: "Enrôlements", value: 3840, trendPercent: 8.4 },
      { id: "verifications", label: "Vérifications", value: 28260, trendPercent: 3.1 },
      { id: "active-sites", label: "Sites actifs", value: 78, trendPercent: 1.3 },
    ],
    [
      { label: "Région la plus active", value: "Bamako" },
      { label: "Délai médian d’enrôlement", value: "6 min 24 s" },
      { label: "Taux de synchronisation", value: "98,7 %" },
    ],
  );
}

export async function getBiometricsReport(): Promise<ReportData> {
  return report(
    "biometrics",
    "Performance biométrique",
    "Qualité et résultats des vérifications biométriques.",
    [
      { id: "success", label: "Taux de réussite", value: 94.2, unit: "%", trendPercent: 1.8 },
      { id: "failures", label: "Échecs", value: 763, trendPercent: -4.6 },
      { id: "manual", label: "Analyses manuelles", value: 218, trendPercent: 2.2 },
    ],
    [
      { label: "Motif d’échec principal", value: "Qualité de capture" },
      { label: "Temps médian", value: "2,4 s" },
      { label: "Appareils conformes", value: "96,1 %" },
    ],
  );
}

export async function getQrReport(): Promise<ReportData> {
  return report(
    "temporary-qr",
    "QR temporaires",
    "Suivi des QR temporaires émis sur les 30 derniers jours.",
    [
      { id: "issued", label: "QR émis", value: 1294, trendPercent: 6.7 },
      { id: "used", label: "QR utilisés", value: 1018, trendPercent: 4.2 },
      { id: "revoked", label: "QR révoqués", value: 23, trendPercent: -8.0 },
    ],
    [
      { label: "Taux d’utilisation", value: "78,7 %" },
      { label: "Durée moyenne avant usage", value: "3 h 18 min" },
      { label: "Expirés sans usage", value: "253" },
    ],
  );
}

export async function getFraudReport(): Promise<ReportData> {
  return report(
    "fraud",
    "Alertes et fraude",
    "Pilotage des signaux et décisions de fraude.",
    [
      { id: "signals", label: "Signaux détectés", value: 186, trendPercent: 12.5 },
      { id: "confirmed", label: "Fraudes confirmées", value: 19, trendPercent: 5.6 },
      { id: "open", label: "Alertes ouvertes", value: 34, trendPercent: -3.2 },
    ],
    [
      { label: "Délai médian de décision", value: "11 h 42 min" },
      { label: "Signal principal", value: "Appareil révoqué" },
      { label: "Taux de classement sans suite", value: "38,2 %" },
    ],
  );
}

export async function createExportJob(reportId: string): Promise<ExportJob> {
  if (!reports.some((item) => item.id === reportId)) {
    throw new Error("Rapport inconnu.");
  }
  const id = `EXP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const job: ExportJob = {
    id,
    reportId,
    status: "READY",
    createdAt: new Date().toISOString(),
    downloadUrl: `/exports/${id}.csv`,
  };
  exportJobs.set(id, job);
  return job;
}

export async function getExportJob(id: string): Promise<ExportJob | undefined> {
  return exportJobs.get(id);
}

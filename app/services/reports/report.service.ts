import { apiRequest } from "~/server/api/client.server";
import type { ExportJob, ExportJobStatus, ReportSummary } from "~/types/admin";

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
  {
    id: "costs",
    title: "Prestations et coûts",
    description:
      "Classement des bénéficiaires, dépenses par catégorie, établissement et reste à charge.",
    href: "/reports/costs",
  },
];

type ApiExport = {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  storagePath?: string | null;
  readyAt?: string | null;
  expiresAt?: string | null;
};

type DownloadResponse = { url: string; expiresAt?: string | null };

function report(
  id: string,
  title: string,
  description: string,
  kpis: ReportKpi[],
  highlights: ReportData["highlights"],
): ReportData {
  return { id, title, description, kpis, highlights, generatedAt: new Date().toISOString() };
}

function mapExportStatus(status: string): ExportJobStatus {
  switch (status) {
    case "READY":
      return "READY";
    case "PENDING":
      return "QUEUED";
    case "FAILED":
    case "EXPIRED":
      return "FAILED";
    default:
      return "RUNNING";
  }
}

function toExportJob(row: ApiExport, downloadUrl?: string): ExportJob {
  return {
    id: row.id,
    reportId: row.type,
    status: mapExportStatus(row.status),
    createdAt:
      typeof row.createdAt === "string"
        ? row.createdAt
        : new Date(String(row.createdAt)).toISOString(),
    downloadUrl,
    error: row.status === "FAILED" || row.status === "EXPIRED" ? "Export indisponible." : undefined,
  };
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
    "Qualité de capture et bascules manuelles (sans images ni scores bruts).",
    [
      { id: "quality_good", label: "Qualité bonne", value: 78.4, unit: "%", trendPercent: 1.8 },
      { id: "quality_acceptable", label: "Qualité acceptable", value: 15.1, unit: "%", trendPercent: -0.4 },
      { id: "quality_poor", label: "Qualité faible", value: 6.5, unit: "%", trendPercent: -2.1 },
      { id: "liveness_fail", label: "Échecs liveness", value: 142, trendPercent: -3.2 },
      { id: "manual", label: "Bascule contrôle manuel", value: 218, trendPercent: 2.2 },
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
    "Suivi par motif, durée, usage et révocation (30 derniers jours).",
    [
      { id: "issued", label: "QR émis", value: 1294, trendPercent: 6.7 },
      { id: "used", label: "QR utilisés", value: 1018, trendPercent: 4.2 },
      { id: "revoked", label: "QR révoqués", value: 23, trendPercent: -8.0 },
      { id: "lost_card", label: "Motif carte perdue", value: 612, trendPercent: 3.1 },
      { id: "duration_24h", label: "Durée 24 h", value: 480, trendPercent: 1.2 },
    ],
    [
      { label: "Taux d’utilisation", value: "78,7 %" },
      { label: "Taux de révocation", value: "1,8 %" },
      { label: "Durée moyenne avant usage", value: "3 h 18 min" },
      { label: "Motif dominant", value: "Carte perdue" },
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

export async function createExportJob(
  reportId: string,
  accessToken: string,
): Promise<ExportJob> {
  if (!reports.some((item) => item.id === reportId)) {
    throw new Error("Rapport inconnu.");
  }
  const row = await apiRequest<ApiExport>("/admin/reports/exports", {
    method: "POST",
    accessToken,
    body: { type: reportId },
  });
  let downloadUrl: string | undefined;
  if (mapExportStatus(row.status) === "READY") {
    try {
      const download = await apiRequest<DownloadResponse>(
        `/admin/reports/exports/${row.id}/download`,
        { accessToken },
      );
      downloadUrl = download.url;
    } catch {
      downloadUrl = undefined;
    }
  }
  return toExportJob(row, downloadUrl);
}

export async function getExportJob(
  id: string,
  accessToken: string,
): Promise<ExportJob | undefined> {
  try {
    const row = await apiRequest<ApiExport>(`/admin/reports/exports/${id}`, {
      accessToken,
    });
    let downloadUrl: string | undefined;
    if (mapExportStatus(row.status) === "READY") {
      try {
        const download = await apiRequest<DownloadResponse>(
          `/admin/reports/exports/${id}/download`,
          { accessToken },
        );
        downloadUrl = download.url;
      } catch {
        downloadUrl = undefined;
      }
    }
    return toExportJob(row, downloadUrl);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 404
    ) {
      return undefined;
    }
    throw error;
  }
}

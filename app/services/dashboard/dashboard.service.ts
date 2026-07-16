import type {
  AdminSessionUser,
  DashboardOverview,
  DashboardPeriod,
  DashboardSeriesPoint,
} from "~/types/admin";

const PERIOD_MULTIPLIER: Record<DashboardPeriod, number> = {
  "7d": 1,
  "30d": 3.8,
  "90d": 11,
};

const SERIES_CONFIG: Record<
  DashboardPeriod,
  { points: number; intervalDays: number; volumeScale: number }
> = {
  "7d": { points: 7, intervalDays: 1, volumeScale: 1 },
  "30d": { points: 14, intervalDays: 2, volumeScale: 2.1 },
  "90d": { points: 12, intervalDays: 8, volumeScale: 6.3 },
};

function buildSeries(
  period: DashboardPeriod,
  generatedAt: Date,
): DashboardSeriesPoint[] {
  const { points, intervalDays, volumeScale } = SERIES_CONFIG[period];

  return Array.from({ length: points }, (_, index) => {
    const date = new Date(generatedAt);
    date.setUTCDate(
      date.getUTCDate() - (points - index - 1) * intervalDays,
    );

    const wave = Math.sin(index * 1.2) * 0.12;
    const growth = 0.9 + index * 0.018;

    return {
      date: date.toISOString(),
      enrollments: Math.round(126 * volumeScale * growth * (1 + wave)),
      verifications: Math.round(
        930 * volumeScale * growth * (1 + wave * 0.55),
      ),
      alerts: Math.max(
        1,
        Math.round(5 * volumeScale * (1 + wave * 1.4)),
      ),
    };
  });
}

export async function getDashboardOverview(input: {
  user: AdminSessionUser;
  period: DashboardPeriod;
  empty?: boolean;
}): Promise<DashboardOverview> {
  const multiplier = PERIOD_MULTIPLIER[input.period];
  const generatedAt = new Date();

  // Simulated latency to exercise pending UI in development.
  await new Promise((resolve) => setTimeout(resolve, 120));

  if (input.empty) {
    return {
      period: input.period,
      generatedAt: generatedAt.toISOString(),
      kpis: [],
      priorityAlerts: [],
      recentActivity: [],
      series: [],
      empty: true,
    };
  }

  return {
    period: input.period,
    generatedAt: generatedAt.toISOString(),
    kpis: [
      {
        id: "enrollments",
        label: "Enrôlements",
        value: Math.round(128 * multiplier),
        trendPercent: 8.4,
        trendIntent: "positive",
      },
      {
        id: "verifications_ok",
        label: "Vérifications confirmées",
        value: Math.round(942 * multiplier),
        trendPercent: 3.1,
        trendIntent: "positive",
      },
      {
        id: "verifications_doubt",
        label: "Vérifs douteuses / manuelles",
        value: Math.round(48 * multiplier),
        trendPercent: -1.2,
        trendIntent: "positive",
      },
      {
        id: "qr_active",
        label: "QR temporaires actifs",
        value: Math.round(56 * multiplier),
        trendPercent: 2.0,
        trendIntent: "neutral",
      },
      {
        id: "pending_sync",
        label: "Sync offline en attente",
        value: Math.round(11 * Math.max(1, multiplier / 2)),
        trendPercent: 4.5,
        trendIntent: "negative",
      },
      {
        id: "incomplete_dossiers",
        label: "Dossiers incomplets",
        value: Math.round(37 * multiplier),
        trendPercent: -2.1,
        trendIntent: "positive",
      },
      {
        id: "provisional_pending",
        label: "Provisoires à valider",
        value: Math.round(14 * Math.max(1, multiplier / 2)),
        trendPercent: 6.0,
        trendIntent: "negative",
      },
      {
        id: "alerts_critical",
        label: "Alertes critiques",
        value: Math.round(4 * Math.max(1, multiplier / 2)),
        trendPercent: 12.5,
        trendIntent: "negative",
      },
    ],
    priorityAlerts: [
      {
        id: "alr_001",
        title: "Pic de vérifications échouées — Bamako Centre",
        severity: "HIGH",
        status: "NEW",
        createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      },
      {
        id: "alr_002",
        title: "Appareil révoqué réutilisé",
        severity: "CRITICAL",
        status: "ASSIGNED",
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      },
      {
        id: "alr_003",
        title: "Enrôlements en attente > 48 h",
        severity: "MEDIUM",
        status: "UNDER_REVIEW",
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
    ],
    recentActivity: [
      {
        id: "act_001",
        label: "Validation d'enrôlement",
        actor: input.user.displayName,
        createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      },
      {
        id: "act_002",
        label: "Consultation bénéficiaire",
        actor: "Fatoumata Sangaré",
        createdAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
      },
      {
        id: "act_003",
        label: "Export rapport vérifications",
        actor: "Moussa Coulibaly",
        createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      },
    ],
    series: buildSeries(input.period, generatedAt),
  };
}

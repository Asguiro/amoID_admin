import {
  Banknote,
  BarChart3,
  CheckCircle2,
  Fingerprint,
  QrCode,
  ShieldAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Form, Link, useNavigation } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { ExportButton } from "~/components/ui/ExportButton";
import { MetricCard } from "~/components/ui/MetricCard";
import type { ReportData } from "~/services/reports/report.service";
import type { ExportJob, ReportSummary } from "~/types/admin";
import { CsrfField } from "~/components/security/CsrfProvider";

const reportIcons: Record<string, LucideIcon> = {
  operations: BarChart3,
  biometrics: Fingerprint,
  "temporary-qr": QrCode,
  fraud: ShieldAlert,
  costs: Banknote,
};

export function ReportsHubPage({ reports }: { reports: ReportSummary[] }) {
  return (
    <>
      <PageHeader
        title="Rapports"
        description="Indicateurs consolidés et exports contrôlés pour le pilotage."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {reports.map((report) => {
          const Icon = reportIcons[report.id] ?? BarChart3;
          return (
            <Link key={report.id} to={report.href} className="group">
              <AppCard className="h-full transition-transform group-hover:-translate-y-1" padding="lg">
                <Icon className="mb-5 size-8 text-primary" aria-hidden />
                <h2 className="amo-display text-lg font-semibold text-secondary">{report.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-base-content/60">{report.description}</p>
                <span className="mt-5 inline-block text-sm font-medium text-primary">Consulter le rapport →</span>
              </AppCard>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export function ReportDetailPage({
  report,
  canExport,
  exportJob,
}: {
  report: ReportData;
  canExport: boolean;
  exportJob?: ExportJob;
}) {
  const navigation = useNavigation();
  const exporting = navigation.state === "submitting";
  return (
    <>
      <PageHeader
        title={report.title}
        description={report.description}
        backTo="/reports"
        backLabel="Retour aux rapports"
        actions={
          canExport ? (
            <Form method="post">
              <CsrfField />
              <ExportButton
                busy={exporting}
                label="Créer un export CSV"
                variant="primary"
              />
            </Form>
          ) : undefined
        }
      />
      {exportJob ? (
        <div role="status" className="alert alert-success mb-6">
          <CheckCircle2 className="size-5" aria-hidden />
          <span>Export {exportJob.id} prêt.</span>
          {exportJob.downloadUrl ? (
            <a className="btn btn-sm" href={exportJob.downloadUrl} download>Télécharger</a>
          ) : null}
        </div>
      ) : null}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {report.kpis.map((kpi, index) => (
          <MetricCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            trendPercent={kpi.trendPercent}
            icon={reportIcons[report.id] ?? BarChart3}
            tint={index === 0 ? "mint" : index === 1 ? "sky" : "gold"}
          />
        ))}
      </section>
      <AppCard className="mt-6" padding="lg">
        <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">Points clés</h2>
        <dl className="grid gap-4 sm:grid-cols-3">
          {report.highlights.map((item) => (
            <div key={item.label} className="rounded-2xl bg-base-200 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-base-content/50">{item.label}</dt>
              <dd className="mt-2 text-lg font-semibold text-secondary">{item.value}</dd>
            </div>
          ))}
        </dl>
      </AppCard>
      <p className="mt-5 text-xs text-base-content/45">
        Données générées le {new Date(report.generatedAt).toLocaleString("fr-FR")}
      </p>
    </>
  );
}

export const OperationsReportPage = ReportDetailPage;
export const BiometricsReportPage = ReportDetailPage;
export const QrReportPage = ReportDetailPage;
export const FraudReportPage = ReportDetailPage;

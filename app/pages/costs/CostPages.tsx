import {
  AlertTriangle,
  Banknote,
  Building2,
  FileSearch,
  MapPin,
  ReceiptText,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { Form, Link } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { EntityAvatar } from "~/components/ui/EntityAvatar";
import { SearchField } from "~/components/ui/SearchField";
import { StatusBadge } from "~/components/ui/StatusBadge";
import { careCategoryLabels } from "~/services/costs/cost.service";
import type {
  BenefitClaim,
  BeneficiaryCostProfile,
  CostBreakdown,
  CostReport,
} from "~/types/admin";

const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

const monthLabel = new Intl.DateTimeFormat("fr-FR", {
  month: "short",
  year: "numeric",
});

function DemoDataNotice() {
  return (
    <div role="status" className="alert alert-warning mb-6 items-start">
      <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div>
        <p className="font-semibold">Données de démonstration</p>
        <p className="text-sm">
          Cette vue prépare le branchement aux flux de prestations et de liquidation
          CANAM/OGD. Aucun montant affiché ici ne doit être utilisé comme donnée comptable.
        </p>
      </div>
    </div>
  );
}

function SummaryMetric({
  label,
  value,
  help,
  icon: Icon,
}: {
  label: string;
  value: string;
  help: string;
  icon: typeof Banknote;
}) {
  return (
    <AppCard padding="md" className="relative overflow-hidden">
      <Icon className="absolute -right-2 -bottom-2 size-20 text-primary opacity-10" aria-hidden />
      <p className="text-sm font-medium text-base-content/60">{label}</p>
      <p className="amo-display mt-2 text-2xl font-semibold text-secondary">{value}</p>
      <p className="mt-2 text-xs text-base-content/50">{help}</p>
    </AppCard>
  );
}

function BreakdownList({
  title,
  items,
  emptyLabel = "Aucune dépense sur la période.",
}: {
  title: string;
  items: CostBreakdown[];
  emptyLabel?: string;
}) {
  return (
    <AppCard padding="lg">
      <h2 className="amo-display text-lg font-semibold text-secondary">{title}</h2>
      <div className="mt-5 space-y-4">
        {items.length ? (
          items.map((item) => (
            <div key={item.key}>
              <div className="mb-1.5 flex items-center justify-between gap-4 text-sm">
                <span className="min-w-0 truncate font-medium">{item.label}</span>
                <span className="shrink-0 font-semibold text-secondary">
                  {currency.format(item.coveredAmount)}
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-base-200"
                role="progressbar"
                aria-label={`${item.label}, ${item.sharePercent.toFixed(1)} %`}
                aria-valuenow={Math.round(item.sharePercent)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.max(item.sharePercent, 2)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-base-content/50">
                {item.claimsCount} prestation{item.claimsCount > 1 ? "s" : ""} ·{" "}
                {item.sharePercent.toFixed(1)} % de la prise en charge
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-base-content/55">{emptyLabel}</p>
        )}
      </div>
    </AppCard>
  );
}

function claimTone(status: BenefitClaim["status"]) {
  if (status === "PAID" || status === "ACCEPTED") return "success" as const;
  if (status === "REJECTED") return "error" as const;
  return "warning" as const;
}

const claimStatusLabels: Record<BenefitClaim["status"], string> = {
  SUBMITTED: "Soumise",
  UNDER_REVIEW: "En contrôle",
  ACCEPTED: "Acceptée",
  PAID: "Payée",
  PARTIALLY_REJECTED: "Rejet partiel",
  REJECTED: "Rejetée",
};

function ClaimHistory({ claims }: { claims: BenefitClaim[] }) {
  return (
    <AppCard padding="none" className="overflow-hidden">
      <div className="border-b border-base-200 p-6">
        <h2 className="amo-display text-lg font-semibold text-secondary">
          Historique détaillé des prestations
        </h2>
        <p className="mt-1 text-sm text-base-content/55">
          Date, nature, lieu, facturation, part AMO, ticket modérateur et contrôle.
        </p>
      </div>
      <div className="divide-y divide-base-200">
        {claims.map((claim) => (
          <details key={claim.id} className="group px-6 py-5 open:bg-base-200/35">
            <summary className="cursor-pointer list-none">
              <div className="grid items-center gap-3 md:grid-cols-[7rem_minmax(0,1fr)_10rem_9rem]">
                <div>
                  <p className="text-sm font-semibold text-secondary">
                    {new Date(`${claim.serviceDate}T00:00:00`).toLocaleDateString("fr-FR")}
                  </p>
                  <p className="text-xs text-base-content/45">{claim.claimNumber}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{claim.description}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-base-content/55">
                    <MapPin className="size-3.5" aria-hidden />
                    {claim.establishmentName} · {claim.region}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-base-content/50">Part AMO</p>
                  <p className="font-semibold text-secondary">
                    {currency.format(claim.coveredAmount)}
                  </p>
                </div>
                <StatusBadge tone={claimTone(claim.status)}>
                  {claimStatusLabels[claim.status]}
                </StatusBadge>
              </div>
            </summary>
            <div className="mt-5 grid gap-4 rounded-2xl bg-base-100 p-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-base-content/50">Facturé</p>
                <p className="mt-1 font-semibold">{currency.format(claim.billedAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-base-content/50">Éligible</p>
                <p className="mt-1 font-semibold">{currency.format(claim.eligibleAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-base-content/50">Ticket modérateur</p>
                <p className="mt-1 font-semibold">{currency.format(claim.copayAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-base-content/50">Rejeté</p>
                <p className="mt-1 font-semibold">{currency.format(claim.rejectedAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-base-content/50">Taux appliqué</p>
                <p className="mt-1 font-semibold">
                  {claim.coverageRate} % ·{" "}
                  {claim.careSetting === "HOSPITAL" ? "Hospitalisation" : "Ambulatoire"}
                </p>
              </div>
              <div>
                <p className="text-xs text-base-content/50">Facture</p>
                <p className="mt-1 font-semibold">{claim.invoiceReference}</p>
              </div>
              <div>
                <p className="text-xs text-base-content/50">Vérification</p>
                <p className="mt-1 font-semibold">{claim.verificationChannel}</p>
              </div>
              <div>
                <p className="text-xs text-base-content/50">Code nomenclature</p>
                <p className="mt-1 font-semibold">{claim.lines[0]?.code ?? "—"}</p>
              </div>
              {claim.anomalySignals.length ? (
                <div className="sm:col-span-2 lg:col-span-4">
                  <p className="text-xs font-medium text-warning">Signal de contrôle</p>
                  <p className="mt-1">{claim.anomalySignals.join(" · ")}</p>
                </div>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </AppCard>
  );
}

export function BeneficiaryCostsPage({
  profile,
}: {
  profile: BeneficiaryCostProfile;
}) {
  const maxMonthly = Math.max(
    1,
    ...profile.monthlyTrend.map((item) => item.coveredAmount),
  );

  return (
    <>
      <PageHeader
        title={`Prestations et coûts — ${profile.beneficiaryName}`}
        description={`Traçabilité financière complète · ${profile.periodLabel}`}
        leading={<EntityAvatar name={profile.beneficiaryName} size="lg" />}
        backTo={`/beneficiaries/${profile.beneficiaryId}`}
        backLabel="Retour au dossier"
        actions={
          <Link className="btn btn-outline h-10 rounded-xl" to="/reports/costs">
            Comparer les bénéficiaires
          </Link>
        }
      />
      <DemoDataNotice />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryMetric
          label="Pris en charge par l’AMO"
          value={currency.format(profile.totals.coveredAmount)}
          help={`${profile.totals.claimsCount} prestations sur la période`}
          icon={Banknote}
        />
        <SummaryMetric
          label="Montant facturé"
          value={currency.format(profile.totals.billedAmount)}
          help={`${currency.format(profile.totals.eligibleAmount)} éligibles`}
          icon={ReceiptText}
        />
        <SummaryMetric
          label="Ticket modérateur"
          value={currency.format(profile.totals.copayAmount)}
          help="Part restant à la charge de l’assuré"
          icon={ShieldCheck}
        />
        <SummaryMetric
          label="Lieux de soins"
          value={String(profile.totals.establishmentsCount)}
          help={`${profile.totals.regionsCount} région(s) · ${profile.totals.anomalySignalsCount} signal(aux)`}
          icon={Building2}
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <BreakdownList title="Dans quoi ?" items={profile.byCategory} />
        <BreakdownList title="Où ?" items={profile.byEstablishment} />
      </section>

      <AppCard padding="lg" className="mt-6">
        <h2 className="amo-display text-lg font-semibold text-secondary">
          Évolution mensuelle de la prise en charge
        </h2>
        <div className="mt-6 flex h-48 items-end gap-3" aria-label="Dépenses mensuelles">
          {profile.monthlyTrend.map((item) => (
            <div key={item.month} className="flex min-w-0 flex-1 flex-col items-center">
              <span className="mb-2 text-xs font-semibold text-secondary">
                {currency.format(item.coveredAmount)}
              </span>
              <div
                className="w-full max-w-16 rounded-t-xl bg-primary/80"
                style={{ height: `${Math.max((item.coveredAmount / maxMonthly) * 130, 8)}px` }}
              />
              <span className="mt-2 text-center text-xs text-base-content/50">
                {monthLabel.format(new Date(`${item.month}-01T00:00:00`))}
              </span>
            </div>
          ))}
        </div>
      </AppCard>

      <div className="mt-6">
        <ClaimHistory claims={profile.claims} />
      </div>
    </>
  );
}

export function CostsReportPage({
  report,
  query,
}: {
  report: CostReport;
  query: string;
}) {
  return (
    <>
      <PageHeader
        title="Coûts par bénéficiaire"
        description={`Classement et composition des prises en charge · ${report.periodLabel}`}
        backTo="/reports"
        backLabel="Retour aux rapports"
      />
      <DemoDataNotice />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryMetric
          label="Prise en charge AMO"
          value={currency.format(report.totals.coveredAmount)}
          help={`${report.totals.claimsCount} prestations`}
          icon={Banknote}
        />
        <SummaryMetric
          label="Bénéficiaires"
          value={String(report.totals.beneficiariesCount)}
          help="Avec au moins une prestation"
          icon={Users}
        />
        <SummaryMetric
          label="Ticket modérateur"
          value={currency.format(report.totals.copayAmount)}
          help="Reste à charge cumulé"
          icon={ShieldCheck}
        />
        <SummaryMetric
          label="Montants rejetés"
          value={currency.format(report.totals.rejectedAmount)}
          help="Écart facturé non pris en charge"
          icon={FileSearch}
        />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,0.7fr)]">
        <AppCard padding="none" className="overflow-hidden">
          <div className="border-b border-base-200 p-5">
            <Form method="get" className="flex flex-col gap-3 sm:flex-row">
              <SearchField
                name="q"
                defaultValue={query}
                placeholder="Nom, numéro AMO ou région…"
                className="flex-1"
              />
              <button className="btn btn-primary rounded-xl" type="submit">
                Rechercher
              </button>
            </Form>
          </div>
          <div className="max-w-full overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Rang / bénéficiaire</th>
                  <th>Prestations</th>
                  <th>Catégorie principale</th>
                  <th className="text-right">Part AMO</th>
                  <th>Contrôle</th>
                </tr>
              </thead>
              <tbody>
                {report.ranking.map((item, index) => (
                  <tr key={item.beneficiaryId}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                        <div>
                          <Link
                            className="font-semibold text-secondary hover:text-primary hover:underline"
                            to={`/beneficiaries/${item.beneficiaryId}/costs`}
                          >
                            {item.beneficiaryName}
                          </Link>
                          <p className="text-xs text-base-content/50">
                            {item.amoNumberMasked} · {item.region}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      {item.claimsCount}
                      <p className="text-xs text-base-content/45">
                        {item.establishmentsCount} établissement(s)
                      </p>
                    </td>
                    <td>{careCategoryLabels[item.topCategory]}</td>
                    <td className="text-right font-semibold text-secondary">
                      {currency.format(item.coveredAmount)}
                    </td>
                    <td>
                      {item.anomalySignalsCount ? (
                        <StatusBadge tone="warning">
                          {item.anomalySignalsCount} signal
                        </StatusBadge>
                      ) : (
                        <StatusBadge tone="success">Aucun signal</StatusBadge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!report.ranking.length ? (
            <p className="p-8 text-center text-sm text-base-content/55">
              Aucun bénéficiaire ne correspond à cette recherche.
            </p>
          ) : null}
        </AppCard>
        <div className="space-y-6">
          <BreakdownList title="Répartition des coûts" items={report.byCategory} />
          <AppCard padding="lg">
            <Stethoscope className="size-7 text-primary" aria-hidden />
            <h2 className="amo-display mt-4 text-lg font-semibold text-secondary">
              Coût élevé ≠ fraude
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-base-content/60">
              Le classement sert à piloter les dépenses. Une enquête nécessite des signaux
              concordants : fréquence, nomadisme médical, doublons, prix plafond, identité,
              prescriptions et pièces médicales.
            </p>
          </AppCard>
        </div>
      </div>
    </>
  );
}

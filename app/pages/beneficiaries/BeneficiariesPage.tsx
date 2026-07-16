import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { AuditTimeline } from "~/components/ui/AuditTimeline";
import { DataTable } from "~/components/ui/DataTable";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { FilterBar } from "~/components/ui/FilterBar";
import { SearchField } from "~/components/ui/SearchField";
import { SensitiveDataReveal } from "~/components/ui/SensitiveDataReveal";
import { StatusBadge } from "~/components/ui/StatusBadge";
import type {
  Beneficiary,
  BeneficiaryDetail,
  PaginatedResponse,
} from "~/types/admin";

const beneficiaryColumns: ColumnDef<Beneficiary>[] = [
  {
    accessorKey: "displayName",
    header: "Bénéficiaire",
    cell: ({ row }) => (
      <Link
        className="font-medium text-primary hover:underline"
        to={`/beneficiaries/${row.original.id}`}
      >
        {row.original.displayName}
      </Link>
    ),
  },
  { accessorKey: "ninaMasked", header: "NINA" },
  { accessorKey: "amoNumberMasked", header: "N° AMO" },
  { accessorKey: "establishmentName", header: "Établissement" },
  { accessorKey: "region", header: "Région" },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => (
      <StatusBadge
        tone={
          row.original.status === "ACTIVE"
            ? "success"
            : row.original.status === "SUSPENDED"
              ? "error"
              : "warning"
        }
      >
        {row.original.status === "ACTIVE"
          ? "Actif"
          : row.original.status === "SUSPENDED"
            ? "Suspendu"
            : "En attente"}
      </StatusBadge>
    ),
  },
];

export function BeneficiariesPage({
  result,
  q,
}: {
  result: PaginatedResponse<Beneficiary>;
  q?: string;
}) {
  return (
    <>
      <PageHeader
        title="Bénéficiaires"
        description="Recherche et consultation des dossiers bénéficiaires."
      />
      <Form method="get">
        <FilterBar>
          <SearchField
            defaultValue={q}
            placeholder="Nom, NINA ou numéro AMO"
          />
          <button className="amo-filter-btn" type="submit">
            Rechercher
          </button>
        </FilterBar>
      </Form>
      <DataTable
        className="mt-5"
        columns={beneficiaryColumns}
        data={result.items}
        pagination={result.pagination}
        buildPageHref={(page) =>
          `?q=${encodeURIComponent(q ?? "")}&page=${page}`
        }
      />
    </>
  );
}

export function BeneficiaryDetailPage({
  beneficiary,
  canReveal,
  sensitive,
}: {
  beneficiary: BeneficiaryDetail;
  canReveal: boolean;
  sensitive?: { nina?: string; amoNumber?: string };
}) {
  return (
    <>
      <PageHeader
        title={beneficiary.displayName}
        description={`${beneficiary.establishmentName} · ${beneficiary.region}`}
        backTo="/beneficiaries"
        backLabel="Retour aux bénéficiaires"
        badge={
          <StatusBadge
            tone={
              beneficiary.status === "ACTIVE"
                ? "success"
                : beneficiary.status === "SUSPENDED"
                  ? "error"
                  : "warning"
            }
          >
            {beneficiary.status === "ACTIVE"
              ? "Actif"
              : beneficiary.status === "SUSPENDED"
                ? "Suspendu"
                : "En attente"}
          </StatusBadge>
        }
        actions={
          <>
            <Link
              className="btn btn-outline h-10 rounded-xl"
              to="activity"
            >
              Activité
            </Link>
            <Link
              className="btn btn-outline h-10 rounded-xl"
              to="coverage"
            >
              Couverture
            </Link>
            <Link
              className="btn btn-outline h-10 rounded-xl"
              to="temporary-qr"
            >
              QR temporaires
            </Link>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <AppCard padding="lg">
          <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
            Identité
          </h2>
          <div className="space-y-3">
            <SensitiveDataReveal
              label="NINA"
              maskedValue={beneficiary.ninaMasked}
              revealedValue={sensitive?.nina}
              canReveal={canReveal}
              onReveal={() => undefined}
            />
            <SensitiveDataReveal
              label="Numéro AMO"
              maskedValue={beneficiary.amoNumberMasked}
              revealedValue={sensitive?.amoNumber}
              canReveal={canReveal}
              onReveal={() => undefined}
            />
            <DetailGrid>
              <DetailField label="Téléphone">
                {beneficiary.phoneMasked}
              </DetailField>
              <DetailField label="Date de naissance">
                {beneficiary.dateOfBirth}
              </DetailField>
            </DetailGrid>
          </div>
        </AppCard>

        <AppCard padding="lg">
          <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
            Situation
          </h2>
          <DetailGrid>
            <DetailField label="Couverture">
              {beneficiary.coverageStatus}
            </DetailField>
            <DetailField label="Dernière mise à jour">
              {new Date(beneficiary.updatedAt).toLocaleString("fr-FR")}
            </DetailField>
          </DetailGrid>
        </AppCard>
      </div>
    </>
  );
}

export function BeneficiaryActivityPage({
  beneficiary,
}: {
  beneficiary: BeneficiaryDetail;
}) {
  return (
    <>
      <PageHeader
        title={`Activité — ${beneficiary.displayName}`}
        backTo={`/beneficiaries/${beneficiary.id}`}
        backLabel="Retour au dossier"
      />
      <AppCard padding="lg">
        <AuditTimeline items={beneficiary.activity} />
      </AppCard>
    </>
  );
}

export function BeneficiaryCoveragePage({
  beneficiary,
}: {
  beneficiary: BeneficiaryDetail;
}) {
  return (
    <>
      <PageHeader
        title={`Couverture — ${beneficiary.displayName}`}
        backTo={`/beneficiaries/${beneficiary.id}`}
        backLabel="Retour au dossier"
      />
      <AppCard padding="lg">
        <div className="space-y-3">
          {beneficiary.coverageHistory.map((coverage) => (
            <div
              key={coverage.id}
              className="rounded-2xl bg-base-200/80 px-5 py-4"
            >
              <p className="font-medium text-secondary">{coverage.label}</p>
              <p className="mt-1 text-sm text-base-content/60">
                Du {coverage.from} au {coverage.to} · {coverage.status}
              </p>
            </div>
          ))}
        </div>
      </AppCard>
    </>
  );
}

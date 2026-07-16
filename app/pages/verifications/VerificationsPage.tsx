import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { DataTable } from "~/components/ui/DataTable";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { FilterBar } from "~/components/ui/FilterBar";
import { SearchField } from "~/components/ui/SearchField";
import { VerificationOutcomeBadge } from "~/components/ui/StatusBadge";
import type {
  PaginatedResponse,
  Verification,
  VerificationDetail,
} from "~/types/admin";

const columns: ColumnDef<Verification>[] = [
  {
    accessorKey: "id",
    header: "Identifiant",
    cell: ({ row }) => (
      <Link
        className="font-medium text-primary hover:underline"
        to={`/verifications/${row.original.id}`}
      >
        {row.original.id}
      </Link>
    ),
  },
  { accessorKey: "beneficiaryMasked", header: "Bénéficiaire" },
  {
    accessorKey: "outcome",
    header: "Résultat",
    cell: ({ row }) => (
      <VerificationOutcomeBadge outcome={row.original.outcome} />
    ),
  },
  { accessorKey: "channel", header: "Canal" },
  { accessorKey: "establishmentName", header: "Établissement" },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleString("fr-FR"),
  },
];

export function VerificationsPage({
  result,
  q,
}: {
  result: PaginatedResponse<Verification>;
  q?: string;
}) {
  return (
    <>
      <PageHeader
        title="Vérifications"
        description="Journal des vérifications d’identité, sans exposition des scores biométriques."
      />
      <Form method="get">
        <FilterBar>
          <SearchField
            defaultValue={q}
            placeholder="Identifiant, bénéficiaire ou établissement"
          />
          <button className="amo-filter-btn" type="submit">
            Rechercher
          </button>
        </FilterBar>
      </Form>
      <DataTable
        className="mt-5"
        columns={columns}
        data={result.items}
        pagination={result.pagination}
        buildPageHref={(page) =>
          `?q=${encodeURIComponent(q ?? "")}&page=${page}`
        }
      />
    </>
  );
}

export function VerificationDetailPage({
  verification,
}: {
  verification: VerificationDetail;
}) {
  return (
    <>
      <PageHeader
        title={`Vérification ${verification.id}`}
        description={verification.beneficiaryMasked}
        backTo="/verifications"
        backLabel="Retour aux vérifications"
        badge={
          <VerificationOutcomeBadge outcome={verification.outcome} />
        }
      />
      <AppCard className="max-w-4xl" padding="lg">
        <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
          Détail
        </h2>
        <DetailGrid columns={3}>
          <DetailField label="Classe de résultat">
            {verification.outcome}
          </DetailField>
          <DetailField label="Canal">{verification.channel}</DetailField>
          <DetailField label="Appareil">{verification.device}</DetailField>
          <DetailField label="Agent">{verification.agentName}</DetailField>
          <DetailField label="Point de service">
            {verification.metadata.pointDeService}
          </DetailField>
          <DetailField label="Version application">
            {verification.metadata.versionApplication}
          </DetailField>
        </DetailGrid>
        <p className="mt-6 text-xs text-base-content/50">
          Le score biométrique brut n’est jamais exposé dans l’interface
          d’administration.
        </p>
      </AppCard>
    </>
  );
}

import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { AuditTimeline } from "~/components/ui/AuditTimeline";
import { DataTable } from "~/components/ui/DataTable";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { DetailSectionCard } from "~/components/ui/DetailSectionCard";
import { FilterBar } from "~/components/ui/FilterBar";
import { FilterSelect } from "~/components/ui/FilterSelect";
import { SearchField } from "~/components/ui/SearchField";
import { PreparedMediaSlot } from "~/components/ui/MediaGallery";
import { StatusBadge, VerificationOutcomeBadge } from "~/components/ui/StatusBadge";
import { btnFilterSubmit } from "~/components/ui/uiClasses";
import type {
  ListQuery,
  PaginatedResponse,
  Verification,
  VerificationDetail,
} from "~/types/admin";
import { buildListHref, countActiveListFilters } from "~/utils/search-params";

const decisionLabels = {
  CONFIRM: "Confirmé",
  REJECT: "Rejeté",
  MANUAL: "Contrôle manuel",
} as const;

const confidenceLabels = {
  HIGH: "Élevée",
  MEDIUM: "Moyenne",
  LOW: "Faible",
} as const;

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
  {
    accessorKey: "decision",
    header: "Décision",
    cell: ({ row }) =>
      row.original.decision
        ? decisionLabels[row.original.decision]
        : "—",
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
  query,
}: {
  result: PaginatedResponse<Verification>;
  query: ListQuery;
}) {
  return (
    <>
      <PageHeader
        title="Vérifications"
        description="Journal des vérifications d’identité, sans exposition des scores biométriques."
      />
      <Form method="get">
        <FilterBar
          activeFilterCount={countActiveListFilters(query)}
          resetHref="/verifications"
          label="Rechercher et filtrer les vérifications"
        >
          <SearchField
            defaultValue={query.q}
            placeholder="Identifiant, bénéficiaire ou établissement"
          />
          <FilterSelect
            name="status"
            value={query.status}
            label="Filtrer par résultat"
            allLabel="Tous les résultats"
            options={[
              { value: "SUCCESS", label: "Succès" },
              { value: "DOUBT", label: "Doute" },
              { value: "FAILURE", label: "Échec" },
              { value: "MANUAL_REVIEW", label: "Revue manuelle" },
            ]}
          />
          <FilterSelect
            name="decision"
            value={query.decision}
            label="Filtrer par décision"
            allLabel="Toutes décisions"
            options={[
              { value: "CONFIRM", label: "Confirmé" },
              { value: "REJECT", label: "Rejeté" },
              { value: "MANUAL", label: "Manuel" },
            ]}
          />
          <FilterSelect
            name="channel"
            value={query.channel}
            label="Filtrer par canal"
            allLabel="Tous les canaux"
            options={[
              { value: "BIOMETRIC", label: "Biométrie" },
              { value: "QR", label: "QR" },
              { value: "MANUAL", label: "Manuel" },
            ]}
          />
          <button className={btnFilterSubmit} type="submit">
            Filtrer
          </button>
        </FilterBar>
      </Form>
      <DataTable
        className="mt-5"
        columns={columns}
        data={result.items}
        pagination={result.pagination}
        buildPageHref={(page, pageSize = query.pageSize) =>
          buildListHref("/verifications", query, { page, pageSize })
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
      <div className="grid gap-5 lg:grid-cols-2">
        <AppCard padding="lg">
          <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
            Détail
          </h2>
          <DetailGrid columns={2}>
            <DetailField label="Résultat">{verification.outcome}</DetailField>
            <DetailField label="Décision">
              {verification.decision
                ? decisionLabels[verification.decision]
                : "—"}
            </DetailField>
            <DetailField label="Confiance">
              {verification.confidenceLabel
                ? confidenceLabels[verification.confidenceLabel]
                : "—"}
            </DetailField>
            <DetailField label="Canal">{verification.channel}</DetailField>
            {verification.identifierType ? (
              <DetailField label="Identifiant saisi">
                {verification.identifierType}
              </DetailField>
            ) : null}
            <DetailField label="Appareil">{verification.device}</DetailField>
            <DetailField label="Agent">{verification.agentName}</DetailField>
            <DetailField label="Match ID">
              {verification.matchId ?? "—"}
            </DetailField>
            <DetailField label="Point de service">
              {verification.metadata.pointDeService}
            </DetailField>
            <DetailField label="Version application">
              {verification.metadata.versionApplication}
            </DetailField>
            {verification.beneficiaryId ? (
              <DetailField label="Bénéficiaire" className="sm:col-span-2">
                <Link
                  className="text-primary hover:underline"
                  to={`/beneficiaries/${verification.beneficiaryId}`}
                >
                  Voir le dossier
                </Link>
              </DetailField>
            ) : null}
            {verification.primaryHolderName ? (
              <DetailField label="Ouvrant droit" className="sm:col-span-2">
                {verification.primaryHolderName}
                {verification.primaryHolderAmoNumberMasked
                  ? ` · ${verification.primaryHolderAmoNumberMasked}`
                  : ""}
              </DetailField>
            ) : null}
            {verification.manualReason ? (
              <DetailField label="Motif manuel" className="sm:col-span-2">
                {verification.manualReason}
              </DetailField>
            ) : null}
            {verification.manualReference ? (
              <DetailField label="Référence manuelle" className="sm:col-span-2">
                {verification.manualReference}
              </DetailField>
            ) : null}
            {verification.businessRuleNote ? (
              <DetailField label="Règle métier" className="sm:col-span-2">
                <StatusBadge tone="info">{verification.businessRuleNote}</StatusBadge>
              </DetailField>
            ) : null}
          </DetailGrid>
          <p className="mt-6 text-xs text-base-content/50">
            Le score biométrique brut n’est jamais exposé dans l’interface
            d’administration.
          </p>
        </AppCard>

        <AppCard padding="lg">
          <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
            Chronologie
          </h2>
          <AuditTimeline items={verification.timeline} />
        </AppCard>
      </div>
      <DetailSectionCard
        className="mt-5"
        title="Éléments de preuve"
        description="Aucune image ni aucun score biométrique brut n’est exposé dans cette interface."
        badge={<span className="badge badge-warning badge-outline">Accès contrôlé</span>}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <PreparedMediaSlot
            label="Capture associée"
            kind="FACE_CAPTURE"
            availability="SOURCE_NOT_CONNECTED"
          />
          <PreparedMediaSlot
            label="Référence de contrôle"
            kind="OTHER"
            referenceId={verification.manualReference ?? verification.matchId}
            availability={verification.manualReference || verification.matchId ? "RESTRICTED" : "SOURCE_NOT_CONNECTED"}
          />
        </div>
      </DetailSectionCard>
    </>
  );
}

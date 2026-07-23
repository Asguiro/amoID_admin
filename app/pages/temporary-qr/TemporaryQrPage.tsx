import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link, useNavigation } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { AuditTimeline } from "~/components/ui/AuditTimeline";
import { DataTable } from "~/components/ui/DataTable";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { DetailSectionCard } from "~/components/ui/DetailSectionCard";
import { FilterBar } from "~/components/ui/FilterBar";
import { FilterSelect } from "~/components/ui/FilterSelect";
import { FormField } from "~/components/ui/FormField";
import { PreparedMediaSlot } from "~/components/ui/MediaGallery";
import { SearchField } from "~/components/ui/SearchField";
import { QrStatusBadge } from "~/components/ui/StatusBadge";
import { btnFilterSubmit } from "~/components/ui/uiClasses";
import type {
  ListQuery,
  PaginatedResponse,
  TemporaryQr,
  TemporaryQrDetail,
  TemporaryQrReason,
} from "~/types/admin";
import { CsrfField } from "~/components/security/CsrfProvider";
import { buildListHref, countActiveListFilters } from "~/utils/search-params";

const reasonLabels: Record<TemporaryQrReason, string> = {
  LOST_CARD: "Carte perdue",
  DAMAGED_CARD: "Carte endommagée",
  RENEWAL_PENDING: "Renouvellement en cours",
  OPERATIONAL: "Motif opérationnel",
};

const columns: ColumnDef<TemporaryQr>[] = [
  {
    accessorKey: "id",
    header: "Identifiant",
    cell: ({ row }) => (
      <Link
        className="font-medium text-primary hover:underline"
        to={`/temporary-qr/${row.original.id}`}
      >
        {row.original.id}
      </Link>
    ),
  },
  { accessorKey: "beneficiaryMasked", header: "Bénéficiaire" },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <QrStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "reason",
    header: "Motif",
    cell: ({ row }) => reasonLabels[row.original.reason],
  },
  { accessorKey: "duration", header: "Durée" },
  { accessorKey: "issuedBy", header: "Émis par" },
  {
    accessorKey: "issuedAt",
    header: "Émis le",
    cell: ({ row }) =>
      new Date(row.original.issuedAt).toLocaleString("fr-FR"),
  },
];

export function TemporaryQrListPage({
  result,
  query,
  beneficiaryId,
}: {
  result: PaginatedResponse<TemporaryQr>;
  query?: ListQuery;
  q?: string;
  beneficiaryId?: string;
}) {
  const listQuery: ListQuery = query ?? {
    page: 1,
    pageSize: 10,
    q: undefined,
  };

  return (
    <>
      <PageHeader
        title={
          beneficiaryId
            ? "QR temporaires du bénéficiaire"
            : "QR temporaires"
        }
        description="Suivi des codes temporaires et de leur cycle de vie."
        backTo={
          beneficiaryId ? `/beneficiaries/${beneficiaryId}` : undefined
        }
        backLabel="Retour au dossier"
      />
      {!beneficiaryId ? (
        <Form method="get">
          <FilterBar
            activeFilterCount={countActiveListFilters(listQuery)}
            resetHref="/temporary-qr"
            label="Rechercher et filtrer les QR temporaires"
          >
            <SearchField
              defaultValue={listQuery.q}
              placeholder="Identifiant, bénéficiaire ou émetteur"
            />
            <FilterSelect
              name="status"
              value={listQuery.status}
              label="Filtrer par statut"
              allLabel="Tous les statuts"
              options={[
                { value: "ACTIVE", label: "Actif" },
                { value: "USED", label: "Utilisé" },
                { value: "EXPIRED", label: "Expiré" },
                { value: "REVOKED", label: "Révoqué" },
              ]}
            />
            <FilterSelect
              name="reason"
              value={listQuery.reason}
              label="Filtrer par motif"
              allLabel="Tous les motifs"
              options={(Object.keys(reasonLabels) as TemporaryQrReason[]).map(
                (reason) => ({ value: reason, label: reasonLabels[reason] }),
              )}
            />
            <button className={btnFilterSubmit} type="submit">
              Filtrer
            </button>
          </FilterBar>
        </Form>
      ) : null}
      <DataTable
        className="mt-5"
        columns={columns}
        data={result.items}
        pagination={result.pagination}
        buildPageHref={(page, pageSize = listQuery.pageSize) =>
          buildListHref(
            beneficiaryId ? `/beneficiaries/${beneficiaryId}/temporary-qr` : "/temporary-qr",
            listQuery,
            { page, pageSize },
          )
        }
      />
    </>
  );
}

export function TemporaryQrDetailPage({
  qr,
  canRevoke,
  actionData,
}: {
  qr: TemporaryQrDetail;
  canRevoke: boolean;
  actionData?: { error?: string; success?: string };
}) {
  const busy = useNavigation().state === "submitting";

  return (
    <>
      <PageHeader
        title={`QR temporaire ${qr.id}`}
        description={qr.beneficiaryMasked}
        backTo="/temporary-qr"
        backLabel="Retour aux QR temporaires"
        badge={<QrStatusBadge status={qr.status} />}
      />

      {actionData?.error ? (
        <div role="alert" className="alert alert-error mb-4">
          {actionData.error}
        </div>
      ) : null}
      {actionData?.success ? (
        <div role="status" className="alert alert-success mb-4">
          {actionData.success}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <AppCard padding="lg">
          <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
            Informations
          </h2>
          <DetailGrid>
            <DetailField label="Émis par">{qr.issuedBy}</DetailField>
            <DetailField label="Utilisations">
              {String(qr.usageCount)}
            </DetailField>
            <DetailField label="Motif">
              {reasonLabels[qr.reason]}
            </DetailField>
            <DetailField label="Durée">{qr.duration}</DetailField>
            <DetailField label="Émis le">
              {new Date(qr.issuedAt).toLocaleString("fr-FR")}
            </DetailField>
            <DetailField label="Expire le">
              {new Date(qr.expiresAt).toLocaleString("fr-FR")}
            </DetailField>
            <DetailField label="Réf. impression">
              {qr.printReference ?? "—"}
            </DetailField>
            <DetailField label="Session face">
              {qr.faceCaptureSessionId ?? "—"}
            </DetailField>
            <DetailField label="Bénéficiaire" className="sm:col-span-2">
              <Link
                className="text-primary hover:underline"
                to={`/beneficiaries/${qr.beneficiaryId}`}
              >
                Voir le dossier
              </Link>
            </DetailField>
            {qr.revokeReason ? (
              <DetailField label="Motif de révocation" className="sm:col-span-2">
                {qr.revokeReason}
              </DetailField>
            ) : null}
          </DetailGrid>

          {canRevoke && qr.status === "ACTIVE" ? (
            <Form
              method="post"
              className="mt-8 space-y-4 border-t border-base-200 pt-6"
            >
              <CsrfField />
              <FormField label="Motif de révocation">
                <textarea name="reason" required className="amo-textarea" />
              </FormField>
              <button
                disabled={busy}
                className="btn btn-error h-11 w-full rounded-xl"
              >
                Révoquer le QR
              </button>
            </Form>
          ) : null}
        </AppCard>

        <AppCard padding="lg">
          <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
            Historique
          </h2>
          <AuditTimeline items={qr.audit} />
        </AppCard>
      </div>
      <DetailSectionCard
        className="mt-5"
        title="QR, attestation et capture"
        description="Aperçus préparés pour les contenus qui seront fournis par les services sécurisés."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <PreparedMediaSlot
            label="Aperçu du QR"
            kind="QR"
            referenceId={qr.id}
            availability="SOURCE_NOT_CONNECTED"
          />
          <PreparedMediaSlot
            label="Attestation imprimable"
            kind="ATTESTATION"
            referenceId={qr.printReference}
            availability={qr.printReference ? "RESTRICTED" : "SOURCE_NOT_CONNECTED"}
          />
          <PreparedMediaSlot
            label="Capture faciale associée"
            kind="FACE_CAPTURE"
            referenceId={qr.faceCaptureSessionId}
            availability={qr.faceCaptureSessionId ? "RESTRICTED" : "SOURCE_NOT_CONNECTED"}
          />
        </div>
      </DetailSectionCard>
    </>
  );
}

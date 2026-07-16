import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link, useNavigation } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { AuditTimeline } from "~/components/ui/AuditTimeline";
import { DataTable } from "~/components/ui/DataTable";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { FilterBar } from "~/components/ui/FilterBar";
import { FormField } from "~/components/ui/FormField";
import { SearchField } from "~/components/ui/SearchField";
import { QrStatusBadge } from "~/components/ui/StatusBadge";
import type {
  PaginatedResponse,
  TemporaryQr,
  TemporaryQrDetail,
} from "~/types/admin";
import { CsrfField } from "~/components/security/CsrfProvider";

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
  { accessorKey: "issuedBy", header: "Émis par" },
  {
    accessorKey: "issuedAt",
    header: "Émis le",
    cell: ({ row }) =>
      new Date(row.original.issuedAt).toLocaleString("fr-FR"),
  },
  {
    accessorKey: "expiresAt",
    header: "Expiration",
    cell: ({ row }) =>
      new Date(row.original.expiresAt).toLocaleString("fr-FR"),
  },
];

export function TemporaryQrListPage({
  result,
  q,
  beneficiaryId,
}: {
  result: PaginatedResponse<TemporaryQr>;
  q?: string;
  beneficiaryId?: string;
}) {
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
          <FilterBar>
            <SearchField
              defaultValue={q}
              placeholder="Identifiant, bénéficiaire ou émetteur"
            />
            <button className="amo-filter-btn" type="submit">
              Rechercher
            </button>
          </FilterBar>
        </Form>
      ) : null}
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
            <DetailField label="Émis le">
              {new Date(qr.issuedAt).toLocaleString("fr-FR")}
            </DetailField>
            <DetailField label="Expire le">
              {new Date(qr.expiresAt).toLocaleString("fr-FR")}
            </DetailField>
            {qr.revokeReason ? (
              <DetailField label="Motif de révocation" className="sm:col-span-2">
                {qr.revokeReason}
              </DetailField>
            ) : null}
          </DetailGrid>

          {canRevoke && qr.status === "ACTIVE" ? (
            <Form method="post" className="mt-8 space-y-4 border-t border-base-200 pt-6">
              <CsrfField />
              <FormField label="Motif de révocation">
                <textarea
                  name="reason"
                  required
                  className="amo-textarea"
                />
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
    </>
  );
}

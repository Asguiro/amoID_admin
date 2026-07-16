import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AuditTimeline } from "~/components/ui/AuditTimeline";
import { DataTable } from "~/components/ui/DataTable";
import { DetailPageLayout } from "~/components/ui/DetailPageLayout";
import { DetailSectionCard } from "~/components/ui/DetailSectionCard";
import { FilterBar } from "~/components/ui/FilterBar";
import { FilterSelect } from "~/components/ui/FilterSelect";
import { SearchField } from "~/components/ui/SearchField";
import { StatusBadge } from "~/components/ui/StatusBadge";
import type { AuditEvent, ListQuery, PaginatedResponse } from "~/types/admin";
import { buildListHref, countActiveListFilters } from "~/utils/search-params";

const statusMeta = {
  SUCCESS: { label: "Réussi", tone: "success" },
  DENIED: { label: "Refusé", tone: "warning" },
  FAILED: { label: "Échoué", tone: "error" },
} as const;

const columns: ColumnDef<AuditEvent>[] = [
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <Link className="font-medium text-primary hover:underline" to={`/audit/${row.original.id}`}>
        {row.original.action}
      </Link>
    ),
  },
  { accessorKey: "actor", header: "Acteur" },
  { accessorKey: "target", header: "Cible" },
  { accessorKey: "scope", header: "Périmètre" },
  {
    accessorKey: "status",
    header: "Résultat",
    cell: ({ getValue }) => {
      const value = getValue<AuditEvent["status"]>();
      const meta = statusMeta[value];
      return <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString("fr-FR"),
  },
];

export function AuditListPage({
  result,
  query,
}: {
  result: PaginatedResponse<AuditEvent>;
  query: ListQuery;
}) {
  const buildPageHref = (page: number, pageSize = query.pageSize) =>
    buildListHref("/audit", query, { page, pageSize });

  return (
    <>
      <PageHeader
        title="Journal d’audit"
        description="Traçabilité en lecture seule des accès, décisions et opérations sensibles."
      />
      <Form method="get">
        <FilterBar
          activeFilterCount={countActiveListFilters(query)}
          resetHref="/audit"
          label="Rechercher et filtrer le journal d’audit"
        >
          <SearchField
            defaultValue={query.q}
            placeholder="Action, acteur, cible ou corrélation…"
          />
          <FilterSelect
            name="status"
            value={query.status}
            label="Filtrer par résultat"
            allLabel="Tous les résultats"
            options={[
              { value: "SUCCESS", label: "Réussi" },
              { value: "DENIED", label: "Refusé" },
              { value: "FAILED", label: "Échoué" },
            ]}
          />
          <button className="btn btn-primary h-11 rounded-2xl px-5" type="submit">
            Filtrer
          </button>
        </FilterBar>
      </Form>
      <DataTable
        className="mt-5"
        columns={columns}
        data={result.items}
        pagination={result.pagination}
        buildPageHref={buildPageHref}
        emptyTitle="Aucun événement"
      />
    </>
  );
}

export function AuditDetailPage({ event }: { event: AuditEvent }) {
  const meta = statusMeta[event.status];
  return (
    <>
      <PageHeader
        title={event.action}
        description={`Événement ${event.id} · ${event.correlationId}`}
        backTo="/audit"
        backLabel="Retour au journal"
        badge={<StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>}
      />
      <DetailPageLayout
        aside={
          <DetailSectionCard title="Détails techniques">
            <dl className="grid gap-5">
              <div>
                <dt className="text-xs font-semibold tracking-wide text-base-content/50 uppercase">Périmètre</dt>
                <dd className="mt-1.5 text-sm font-medium text-secondary">{event.scope}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-base-content/50 uppercase">Cible</dt>
                <dd className="mt-1.5 text-sm font-medium text-secondary">{event.target}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-base-content/50 uppercase">ID de corrélation</dt>
                <dd className="mt-1.5 break-all font-mono text-xs font-medium text-secondary">{event.correlationId}</dd>
              </div>
            </dl>
          </DetailSectionCard>
        }
      >
        <DetailSectionCard title="Chronologie">
          <AuditTimeline
            items={[
              {
                id: event.id,
                label: `${event.action} — ${event.target}`,
                actor: event.actor,
                createdAt: event.createdAt,
              },
            ]}
          />
        </DetailSectionCard>
      </DetailPageLayout>
    </>
  );
}

import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { AuditTimeline } from "~/components/ui/AuditTimeline";
import { DataTable } from "~/components/ui/DataTable";
import { FilterBar } from "~/components/ui/FilterBar";
import { SearchField } from "~/components/ui/SearchField";
import { StatusBadge } from "~/components/ui/StatusBadge";
import type { AuditEvent, ListQuery, PaginatedResponse } from "~/types/admin";

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
  const buildPageHref = (page: number) => {
    const params = new URLSearchParams();
    if (query.q) params.set("q", query.q);
    if (query.status) params.set("status", query.status);
    params.set("page", String(page));
    return `/audit?${params}`;
  };

  return (
    <>
      <PageHeader
        title="Journal d’audit"
        description="Traçabilité en lecture seule des accès, décisions et opérations sensibles."
      />
      <Form method="get">
        <FilterBar>
          <SearchField
            defaultValue={query.q}
            placeholder="Action, acteur, cible ou corrélation…"
          />
          <select
            name="status"
            defaultValue={query.status ?? ""}
            className="amo-select w-full sm:w-44"
            aria-label="Résultat"
          >
            <option value="">Tous les résultats</option>
            <option value="SUCCESS">Réussi</option>
            <option value="DENIED">Refusé</option>
            <option value="FAILED">Échoué</option>
          </select>
          <button className="amo-filter-btn" type="submit">
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
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <AppCard padding="lg">
          <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
            Chronologie
          </h2>
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
        </AppCard>
        <AppCard padding="lg">
          <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
            Détails techniques
          </h2>
          <dl className="grid gap-5">
            <div>
              <dt className="text-xs font-semibold tracking-wide text-base-content/50 uppercase">
                Périmètre
              </dt>
              <dd className="mt-1.5 text-sm font-medium text-secondary">
                {event.scope}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-base-content/50 uppercase">
                Cible
              </dt>
              <dd className="mt-1.5 text-sm font-medium text-secondary">
                {event.target}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-base-content/50 uppercase">
                ID de corrélation
              </dt>
              <dd className="mt-1.5 font-mono text-xs font-medium text-secondary">
                {event.correlationId}
              </dd>
            </div>
          </dl>
        </AppCard>
      </div>
    </>
  );
}

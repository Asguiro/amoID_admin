import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { DataTable } from "~/components/ui/DataTable";
import { FilterBar } from "~/components/ui/FilterBar";
import { FilterSelect } from "~/components/ui/FilterSelect";
import { SearchField } from "~/components/ui/SearchField";
import { DeviceStatusBadge, StatusBadge } from "~/components/ui/StatusBadge";
import type { Agent, Device, ListQuery, PaginatedResponse } from "~/types/admin";
import { buildListHref, countActiveListFilters } from "~/utils/search-params";

const columns: ColumnDef<Device>[] = [
  {
    accessorKey: "label",
    header: "Appareil",
    cell: ({ row }) => (
      <Link
        className="link link-primary font-medium"
        to={`/devices/${row.original.id}`}
      >
        {row.original.label}
      </Link>
    ),
  },
  { accessorKey: "agentName", header: "Agent" },
  { accessorKey: "establishmentName", header: "Établissement" },
  { accessorKey: "platform", header: "Plateforme" },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <DeviceStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "pendingSyncCount",
    header: "Sync en attente",
    cell: ({ row }) => {
      const count = row.original.pendingSyncCount ?? 0;
      return count > 0 ? (
        <StatusBadge tone="warning">{count}</StatusBadge>
      ) : (
        "0"
      );
    },
  },
  {
    accessorKey: "lastSeenAt",
    header: "Dernière activité",
    cell: ({ row }) =>
      row.original.lastSeenAt
        ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
            new Date(row.original.lastSeenAt),
          )
        : "—",
  },
];

export function DevicesListPage({
  data,
  query,
  agent,
  pendingSync = [],
}: {
  data: PaginatedResponse<Device>;
  query: ListQuery;
  agent?: Agent;
  pendingSync?: Device[];
}) {
  const basePath = agent ? `/agents/${agent.id}/devices` : "/devices";
  const buildPageHref = (page: number, pageSize = query.pageSize) =>
    buildListHref(basePath, query, { page, pageSize });
  return (
    <>
      <PageHeader
        title={agent ? `Appareils de ${agent.displayName}` : "Appareils"}
        description="Consultez les terminaux enregistrés, la confiance et la file de sync offline."
        backTo={agent ? `/agents/${agent.id}` : undefined}
        backLabel="Retour à l’agent"
      />

      {!agent && pendingSync.length > 0 ? (
        <AppCard className="mb-5" padding="lg">
          <h2 className="amo-display mb-3 text-base font-semibold text-secondary">
            File sync offline ({pendingSync.length})
          </h2>
          <ul className="space-y-2 text-sm">
            {pendingSync.map((device) => (
              <li
                key={device.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-warning/10 px-4 py-3"
              >
                <Link
                  className="font-medium text-primary hover:underline"
                  to={`/devices/${device.id}`}
                >
                  {device.label}
                </Link>
                <span>
                  {device.agentName} · {device.pendingSyncCount} en attente
                </span>
              </li>
            ))}
          </ul>
        </AppCard>
      ) : null}

      <Form method="get">
        <FilterBar
          activeFilterCount={countActiveListFilters(query)}
          resetHref={basePath}
          label="Rechercher et filtrer les appareils"
        >
          <SearchField
            defaultValue={query.q}
            placeholder="Appareil, agent ou établissement…"
          />
          <FilterSelect
            name="status"
            value={query.status}
            label="Filtrer par statut"
            allLabel="Tous les statuts"
            options={[
              { value: "PENDING", label: "En attente" },
              { value: "TRUSTED", label: "Approuvés" },
              { value: "REVOKED", label: "Révoqués" },
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
        data={data.items}
        pagination={data.pagination}
        buildPageHref={buildPageHref}
        emptyTitle="Aucun appareil"
      />
    </>
  );
}

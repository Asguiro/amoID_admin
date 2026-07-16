import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { DataTable } from "~/components/ui/DataTable";
import { FilterBar } from "~/components/ui/FilterBar";
import { SearchField } from "~/components/ui/SearchField";
import { DeviceStatusBadge } from "~/components/ui/StatusBadge";
import type { Agent, Device, ListQuery, PaginatedResponse } from "~/types/admin";

const columns: ColumnDef<Device>[] = [
  { accessorKey: "label", header: "Appareil", cell: ({ row }) => <Link className="link link-primary font-medium" to={`/devices/${row.original.id}`}>{row.original.label}</Link> },
  { accessorKey: "agentName", header: "Agent" },
  { accessorKey: "establishmentName", header: "Établissement" },
  { accessorKey: "platform", header: "Plateforme" },
  { accessorKey: "status", header: "Statut", cell: ({ row }) => <DeviceStatusBadge status={row.original.status} /> },
  { accessorKey: "lastSeenAt", header: "Dernière activité", cell: ({ row }) => new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(row.original.lastSeenAt)) },
];

export function DevicesListPage({ data, query, agent }: { data: PaginatedResponse<Device>; query: ListQuery; agent?: Agent }) {
  const basePath = agent ? `/agents/${agent.id}/devices` : "/devices";
  const buildPageHref = (page: number) => {
    const params = new URLSearchParams();
    if (query.q) params.set("q", query.q);
    if (query.status) params.set("status", query.status);
    params.set("page", String(page));
    params.set("pageSize", String(query.pageSize));
    return `${basePath}?${params}`;
  };
  return (
    <>
      <PageHeader
        title={agent ? `Appareils de ${agent.displayName}` : "Appareils"}
        description="Consultez les terminaux enregistrés et leur niveau de confiance."
        backTo={agent ? `/agents/${agent.id}` : undefined}
        backLabel="Retour à l’agent"
      />
      <Form method="get">
        <FilterBar>
          <SearchField
            defaultValue={query.q}
            placeholder="Appareil, agent ou établissement…"
          />
          <select
            name="status"
            defaultValue={query.status ?? ""}
            className="amo-select w-full sm:w-48"
            aria-label="Filtrer par statut"
          >
            <option value="">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="TRUSTED">Approuvés</option>
            <option value="REVOKED">Révoqués</option>
          </select>
          <button className="amo-filter-btn" type="submit">
            Filtrer
          </button>
        </FilterBar>
      </Form>
      <DataTable className="mt-5" columns={columns} data={data.items} pagination={data.pagination} buildPageHref={buildPageHref} emptyTitle="Aucun appareil" />
    </>
  );
}

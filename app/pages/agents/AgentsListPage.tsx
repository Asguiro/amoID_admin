import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { DataTable } from "~/components/ui/DataTable";
import { FilterBar } from "~/components/ui/FilterBar";
import { SearchField } from "~/components/ui/SearchField";
import { AgentStatusBadge } from "~/components/ui/StatusBadge";
import type { Agent, ListQuery, PaginatedResponse } from "~/types/admin";

const columns: ColumnDef<Agent>[] = [
  { accessorKey: "displayName", header: "Agent", cell: ({ row }) => <Link className="link link-primary font-medium" to={`/agents/${row.original.id}`}>{row.original.displayName}</Link> },
  { accessorKey: "email", header: "Courriel" },
  { accessorKey: "role", header: "Rôle" },
  { accessorKey: "establishmentName", header: "Établissement" },
  { accessorKey: "region", header: "Région" },
  { accessorKey: "status", header: "Statut", cell: ({ row }) => <AgentStatusBadge status={row.original.status} /> },
];

export function AgentsListPage({ data, query }: { data: PaginatedResponse<Agent>; query: ListQuery }) {
  const buildPageHref = (page: number) => {
    const params = new URLSearchParams();
    if (query.q) params.set("q", query.q);
    if (query.status) params.set("status", query.status);
    params.set("page", String(page));
    params.set("pageSize", String(query.pageSize));
    return `/agents?${params}`;
  };
  return (
    <>
      <PageHeader title="Agents" description="Gérez les agents et leurs accès opérationnels." actions={<Link className="btn btn-primary h-10 rounded-xl" to="/agents/new">Nouvel agent</Link>} />
      <Form method="get">
        <FilterBar>
          <SearchField
            defaultValue={query.q}
            placeholder="Nom, courriel ou établissement…"
          />
          <select
            name="status"
            defaultValue={query.status ?? ""}
            className="amo-select w-full sm:w-48"
            aria-label="Filtrer par statut"
          >
            <option value="">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="ACTIVE">Actifs</option>
            <option value="SUSPENDED">Suspendus</option>
            <option value="ARCHIVED">Archivés</option>
          </select>
          <button className="amo-filter-btn" type="submit">
            Filtrer
          </button>
        </FilterBar>
      </Form>
      <DataTable className="mt-5" columns={columns} data={data.items} pagination={data.pagination} buildPageHref={buildPageHref} emptyTitle="Aucun agent" />
    </>
  );
}

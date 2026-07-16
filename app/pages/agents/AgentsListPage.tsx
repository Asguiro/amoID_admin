import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { DataTable } from "~/components/ui/DataTable";
import { FilterBar } from "~/components/ui/FilterBar";
import { FilterSelect } from "~/components/ui/FilterSelect";
import { SearchField } from "~/components/ui/SearchField";
import { AgentStatusBadge } from "~/components/ui/StatusBadge";
import type { Agent, ListQuery, PaginatedResponse } from "~/types/admin";
import { ADMIN_ROLE_LABELS } from "~/types/admin";
import { buildListHref, countActiveListFilters } from "~/utils/search-params";

const columns: ColumnDef<Agent>[] = [
  { accessorKey: "displayName", header: "Agent", cell: ({ row }) => <Link className="link link-primary font-medium" to={`/agents/${row.original.id}`}>{row.original.displayName}</Link> },
  { accessorKey: "email", header: "Courriel" },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => ADMIN_ROLE_LABELS[row.original.role] ?? row.original.role,
  },
  { accessorKey: "establishmentName", header: "Établissement" },
  { accessorKey: "region", header: "Région" },
  { accessorKey: "status", header: "Statut", cell: ({ row }) => <AgentStatusBadge status={row.original.status} /> },
];

export function AgentsListPage({ data, query }: { data: PaginatedResponse<Agent>; query: ListQuery }) {
  const buildPageHref = (page: number, pageSize = query.pageSize) =>
    buildListHref("/agents", query, { page, pageSize });
  return (
    <>
      <PageHeader title="Agents" description="Gérez les agents et leurs accès opérationnels." actions={<Link className="btn btn-primary h-10 rounded-xl" to="/agents/new">Nouvel agent</Link>} />
      <Form method="get">
        <FilterBar
          activeFilterCount={countActiveListFilters(query)}
          resetHref="/agents"
          label="Rechercher et filtrer les agents"
        >
          <SearchField
            defaultValue={query.q}
            placeholder="Nom, courriel ou établissement…"
          />
          <FilterSelect
            name="status"
            value={query.status}
            label="Filtrer par statut"
            allLabel="Tous les statuts"
            options={[
              { value: "PENDING", label: "En attente" },
              { value: "ACTIVE", label: "Actifs" },
              { value: "SUSPENDED", label: "Suspendus" },
              { value: "ARCHIVED", label: "Archivés" },
            ]}
          />
          <button className="btn btn-primary h-11 rounded-2xl px-5" type="submit">
            Filtrer
          </button>
        </FilterBar>
      </Form>
      <DataTable className="mt-5" columns={columns} data={data.items} pagination={data.pagination} buildPageHref={buildPageHref} emptyTitle="Aucun agent" />
    </>
  );
}

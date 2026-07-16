import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { DataTable } from "~/components/ui/DataTable";
import { FilterBar } from "~/components/ui/FilterBar";
import { SearchField } from "~/components/ui/SearchField";
import { StatusBadge } from "~/components/ui/StatusBadge";
import type { Establishment, ListQuery, PaginatedResponse } from "~/types/admin";

const typeLabels = { HOSPITAL: "Hôpital", CLINIC: "Clinique", PHARMACY: "Pharmacie", ANTENNA: "Antenne" };

const columns: ColumnDef<Establishment>[] = [
  { accessorKey: "name", header: "Établissement", cell: ({ row }) => <Link className="link link-primary font-medium" to={`/establishments/${row.original.id}`}>{row.original.name}</Link> },
  { accessorKey: "type", header: "Type", cell: ({ row }) => typeLabels[row.original.type] },
  { accessorKey: "region", header: "Région" },
  { accessorKey: "city", header: "Ville" },
  { accessorKey: "agentsCount", header: "Agents" },
  { accessorKey: "devicesCount", header: "Appareils" },
  { accessorKey: "status", header: "Statut", cell: ({ row }) => <StatusBadge tone={row.original.status === "ACTIVE" ? "success" : "neutral"}>{row.original.status === "ACTIVE" ? "Actif" : "Inactif"}</StatusBadge> },
];

export function EstablishmentsListPage({ data, query }: { data: PaginatedResponse<Establishment>; query: ListQuery }) {
  const buildPageHref = (page: number) => {
    const params = new URLSearchParams();
    if (query.q) params.set("q", query.q);
    if (query.status) params.set("status", query.status);
    params.set("page", String(page));
    params.set("pageSize", String(query.pageSize));
    return `/establishments?${params}`;
  };

  return (
    <>
      <PageHeader title="Établissements" description="Gérez les structures de santé raccordées à AMO ID." actions={<Link to="/establishments/new" className="btn btn-primary h-10 rounded-xl">Nouvel établissement</Link>} />
      <Form method="get">
        <FilterBar>
          <SearchField
            defaultValue={query.q}
            placeholder="Nom, région ou ville…"
          />
          <select
            name="status"
            defaultValue={query.status ?? ""}
            className="amo-select w-full sm:w-48"
            aria-label="Filtrer par statut"
          >
            <option value="">Tous les statuts</option>
            <option value="ACTIVE">Actifs</option>
            <option value="INACTIVE">Inactifs</option>
          </select>
          <button className="amo-filter-btn" type="submit">
            Filtrer
          </button>
        </FilterBar>
      </Form>
      <DataTable className="mt-5" columns={columns} data={data.items} pagination={data.pagination} buildPageHref={buildPageHref} emptyTitle="Aucun établissement" />
    </>
  );
}

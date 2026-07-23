import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { DataTable } from "~/components/ui/DataTable";
import { FilterBar } from "~/components/ui/FilterBar";
import { FilterSelect } from "~/components/ui/FilterSelect";
import { SearchField } from "~/components/ui/SearchField";
import { StatusBadge } from "~/components/ui/StatusBadge";
import { btnFilterSubmit, btnHeaderAction } from "~/components/ui/uiClasses";
import type { Establishment, ListQuery, PaginatedResponse } from "~/types/admin";
import { buildListHref, countActiveListFilters } from "~/utils/search-params";

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
  const buildPageHref = (page: number, pageSize = query.pageSize) =>
    buildListHref("/establishments", query, { page, pageSize });

  return (
    <>
      <PageHeader title="Établissements" description="Gérez les structures de santé raccordées à AMO ID." actions={<Link to="/establishments/new" className={btnHeaderAction}>Nouvel établissement</Link>} />
      <Form method="get">
        <FilterBar
          activeFilterCount={countActiveListFilters(query)}
          resetHref="/establishments"
          label="Rechercher et filtrer les établissements"
        >
          <SearchField
            defaultValue={query.q}
            placeholder="Nom, région ou ville…"
          />
          <FilterSelect
            name="status"
            value={query.status}
            label="Filtrer par statut"
            allLabel="Tous les statuts"
            options={[
              { value: "ACTIVE", label: "Actifs" },
              { value: "INACTIVE", label: "Inactifs" },
            ]}
          />
          <button className={btnFilterSubmit} type="submit">
            Filtrer
          </button>
        </FilterBar>
      </Form>
      <DataTable className="mt-5" columns={columns} data={data.items} pagination={data.pagination} buildPageHref={buildPageHref} emptyTitle="Aucun établissement" />
    </>
  );
}

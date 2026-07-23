import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";
import { Form } from "react-router";
import {
  Activity,
  ShieldAlert,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { DataTable } from "~/components/ui/DataTable";
import { FilterBar } from "~/components/ui/FilterBar";
import { FilterSelect } from "~/components/ui/FilterSelect";
import { MetricCard } from "~/components/ui/MetricCard";
import { SearchField } from "~/components/ui/SearchField";
import { DeviceStatusBadge, StatusBadge } from "~/components/ui/StatusBadge";
import { btnFilterSubmit, btnHeaderAction } from "~/components/ui/uiClasses";
import type {
  Agent,
  Device,
  DeviceStats,
  ListQuery,
  PaginatedResponse,
} from "~/types/admin";
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
  {
    accessorKey: "deviceId",
    header: "Identifiant",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.deviceId}</span>
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
  stats,
  canEnroll = false,
}: {
  data: PaginatedResponse<Device>;
  query: ListQuery;
  agent?: Agent;
  pendingSync?: Device[];
  stats?: DeviceStats;
  canEnroll?: boolean;
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
        actions={
          canEnroll && !agent ? (
            <Link to="/devices/new" className={btnHeaderAction}>
              Enrôler un appareil
            </Link>
          ) : canEnroll && agent ? (
            <Link
              to={`/devices/new?agentId=${agent.id}`}
              className={btnHeaderAction}
            >
              Enrôler un appareil
            </Link>
          ) : null
        }
      />

      {!agent && stats ? (
        <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link to="/devices?status=TRUSTED" className="block">
            <MetricCard
              label="Approuvés"
              value={stats.trusted}
              trendPercent={0}
              trendIntent="positive"
              icon={ShieldCheck}
              tint="mint"
            />
          </Link>
          <Link to="/devices?status=PENDING" className="block">
            <MetricCard
              label="En attente"
              value={stats.pending}
              trendPercent={0}
              trendIntent={stats.pending > 0 ? "negative" : "positive"}
              icon={Smartphone}
              tint="gold"
              featured={stats.pending > 0}
            />
          </Link>
          <Link to="/devices?status=REVOKED" className="block">
            <MetricCard
              label="Révoqués"
              value={stats.revoked}
              trendPercent={0}
              trendIntent={stats.revoked > 0 ? "negative" : "neutral"}
              icon={ShieldAlert}
              tint="rose"
            />
          </Link>
          <MetricCard
            label="Sync conflits"
            value={stats.pendingSync}
            trendPercent={0}
            trendIntent={stats.pendingSync > 0 ? "negative" : "neutral"}
            icon={Activity}
            tint="sky"
          />
        </div>
      ) : null}

      {!agent && stats && stats.pending > 0 ? (
        <AppCard className="mb-5 border border-warning/30 bg-warning/10" padding="lg">
          <h2 className="amo-display mb-1 text-base font-semibold text-secondary">
            {stats.pending} appareil{stats.pending > 1 ? "s" : ""} en attente
            d’approbation
          </h2>
          <p className="mb-3 text-sm text-base-content/70">
            Filtrez sur « En attente » pour examiner et approuver les demandes
            d’enregistrement mobile.
          </p>
          <Link to="/devices?status=PENDING" className="link link-primary text-sm">
            Voir la file PENDING
          </Link>
        </AppCard>
      ) : null}

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
          <button className={btnFilterSubmit} type="submit">
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

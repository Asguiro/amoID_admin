import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link, useNavigation } from "react-router";

import { permissions } from "~/config/permissions";
import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { AuditTimeline } from "~/components/ui/AuditTimeline";
import { DataTable } from "~/components/ui/DataTable";
import { DetailSectionCard } from "~/components/ui/DetailSectionCard";
import { FilterBar } from "~/components/ui/FilterBar";
import { FilterSelect } from "~/components/ui/FilterSelect";
import { SearchField } from "~/components/ui/SearchField";
import { PreparedMediaSlot } from "~/components/ui/MediaGallery";
import { AlertSeverityBadge, AlertStatusBadge } from "~/components/ui/StatusBadge";
import { btnFilterSubmit, btnHeaderAction } from "~/components/ui/uiClasses";
import { CsrfField } from "~/components/security/CsrfProvider";
import type {
  AlertDetail,
  AlertItem,
  AlertStatus,
  ListQuery,
  PaginatedResponse,
} from "~/types/admin";
import { buildListHref, countActiveListFilters } from "~/utils/search-params";

const columns: ColumnDef<AlertItem>[] = [
  {
    accessorKey: "title",
    header: "Alerte",
    cell: ({ row }) => (
      <Link className="font-medium text-primary hover:underline" to={`/alerts/${row.original.id}`}>
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "severity",
    header: "Sévérité",
    cell: ({ getValue }) => <AlertSeverityBadge severity={getValue<AlertItem["severity"]>()} />,
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ getValue }) => <AlertStatusBadge status={getValue<AlertStatus>()} />,
  },
  { accessorKey: "assignee", header: "Analyste", cell: ({ getValue }) => getValue() || "Non affectée" },
  { accessorKey: "establishmentName", header: "Établissement" },
  {
    accessorKey: "updatedAt",
    header: "Mise à jour",
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString("fr-FR"),
  },
];

const statuses: Array<{ value: AlertStatus; label: string }> = [
  { value: "NEW", label: "Nouvelle" },
  { value: "ASSIGNED", label: "Affectée" },
  { value: "UNDER_REVIEW", label: "En analyse" },
  { value: "NEEDS_INFORMATION", label: "Info requise" },
  { value: "CONFIRMED", label: "Confirmée" },
  { value: "DISMISSED", label: "Sans suite" },
  { value: "ESCALATED", label: "Escaladée" },
  { value: "CLOSED", label: "Clôturée" },
];

export function AlertsListPage({
  result,
  query,
}: {
  result: PaginatedResponse<AlertItem>;
  query: ListQuery;
}) {
  const buildPageHref = (page: number, pageSize = query.pageSize) =>
    buildListHref("/alerts", query, { page, pageSize });
  return (
    <>
      <PageHeader
        title="Alertes et fraude"
        description="Qualification, investigation et décision sur les signaux détectés."
        actions={<Link className="btn btn-outline h-10 rounded-xl" to="/fraud/rules">Voir les règles</Link>}
      />
      <Form method="get">
        <FilterBar
          activeFilterCount={countActiveListFilters(query)}
          resetHref="/alerts"
          label="Rechercher et filtrer les alertes"
        >
          <SearchField
            defaultValue={query.q}
            placeholder="Alerte, analyste ou établissement…"
          />
          <FilterSelect
            name="status"
            value={query.status}
            label="Filtrer par statut"
            allLabel="Tous les statuts"
            options={statuses}
          />
          <button className={btnFilterSubmit} type="submit">
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
        emptyTitle="Aucune alerte"
      />
    </>
  );
}

const nextStatuses: Partial<Record<AlertStatus, AlertStatus[]>> = {
  ASSIGNED: ["UNDER_REVIEW"],
  UNDER_REVIEW: ["NEEDS_INFORMATION", "CONFIRMED", "DISMISSED", "ESCALATED"],
  NEEDS_INFORMATION: ["UNDER_REVIEW"],
  CONFIRMED: ["CLOSED"],
  DISMISSED: ["CLOSED"],
  ESCALATED: ["CLOSED"],
};

export function AlertDetailPage({
  alert,
  userPermissions,
  actionError,
}: {
  alert: AlertDetail;
  userPermissions: string[];
  actionError?: string;
}) {
  const navigation = useNavigation();
  const pending = navigation.state !== "idle";
  const canAssign = userPermissions.includes(permissions.alertAssign);
  const canInvestigate = userPermissions.includes(permissions.alertInvestigate);
  const canDecide = userPermissions.includes(permissions.alertDecide);
  const availableStatuses = nextStatuses[alert.status] ?? [];
  const canChangeStatus =
    alert.status === "ASSIGNED" ? canInvestigate : canDecide;

  return (
    <>
      <PageHeader
        title={alert.title}
        description={`${alert.id} · ${alert.establishmentName ?? "Établissement inconnu"}`}
        backTo="/alerts"
        backLabel="Retour aux alertes"
        badge={
          <div className="flex flex-wrap items-center gap-2">
            <AlertSeverityBadge severity={alert.severity} />
            <AlertStatusBadge status={alert.status} />
            <span className="badge badge-outline h-7">
              {alert.assignee ?? "Non affectée"}
            </span>
          </div>
        }
      />
      {actionError ? (
        <div role="alert" className="alert alert-error mb-5">
          {actionError}
        </div>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <AppCard padding="lg">
            <h2 className="amo-display text-lg font-semibold text-secondary">Signal détecté</h2>
            <p className="mt-3 leading-relaxed text-base-content/75">{alert.description}</p>
          </AppCard>
          <DetailSectionCard
            title="Preuves et pièces jointes"
            description="Les références de vérification, captures ou documents seront présentées ici lorsqu’elles seront reliées à l’alerte."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <PreparedMediaSlot label="Capture ou événement lié" kind="FACE_CAPTURE" />
              <PreparedMediaSlot label="Pièce jointe d’investigation" kind="OTHER" />
            </div>
          </DetailSectionCard>
          <AppCard padding="lg">
            <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">Chronologie</h2>
            <AuditTimeline items={alert.timeline} />
          </AppCard>
          <AppCard padding="lg">
            <h2 className="amo-display mb-4 text-lg font-semibold text-secondary">Commentaires</h2>
            {canInvestigate ? (
              <Form method="post" className="mb-5 space-y-3">
                <CsrfField />
                <input type="hidden" name="intent" value="comment" />
                <textarea
                  name="body"
                  required
                  className="amo-textarea"
                  placeholder="Ajouter une note d’investigation…"
                />
                <button
                  disabled={pending}
                  className={btnHeaderAction}
                  type="submit"
                >
                  Ajouter
                </button>
              </Form>
            ) : null}
            {alert.comments.length ? (
              <ul className="space-y-3">
                {alert.comments.map((comment) => (
                  <li key={comment.id} className="rounded-2xl bg-base-200 p-4">
                    <p>{comment.body}</p>
                    <p className="mt-2 text-xs text-base-content/55">
                      {comment.actor} · {new Date(comment.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-base-content/55">Aucun commentaire.</p>}
          </AppCard>
        </div>
        <div className="space-y-6">
          {canAssign && (alert.status === "NEW" || alert.status === "ASSIGNED") ? (
            <AppCard padding="lg">
              <h2 className="amo-display mb-4 text-lg font-semibold text-secondary">Affectation</h2>
              <Form method="post" className="space-y-3">
                <CsrfField />
                <input type="hidden" name="intent" value="assign" />
                <input
                  name="assignee"
                  required
                  defaultValue={alert.assignee}
                  className="amo-input"
                  placeholder="Nom de l’analyste"
                />
                <button
                  disabled={pending}
                  className="btn btn-primary h-11 w-full rounded-xl"
                  type="submit"
                >
                  Affecter
                </button>
              </Form>
            </AppCard>
          ) : null}
          {availableStatuses.length > 0 && canChangeStatus ? (
            <AppCard padding="lg">
              <h2 className="amo-display mb-4 text-lg font-semibold text-secondary">Décision</h2>
              <Form method="post" className="space-y-3">
                <CsrfField />
                <input type="hidden" name="intent" value="status" />
                <select name="status" required className="amo-select">
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {statuses.find((item) => item.value === status)?.label}
                    </option>
                  ))}
                </select>
                <textarea
                  name="reason"
                  required
                  className="amo-textarea"
                  placeholder="Motif obligatoire…"
                />
                <button
                  disabled={pending}
                  className="btn btn-primary h-11 w-full rounded-xl"
                  type="submit"
                >
                  Enregistrer la décision
                </button>
              </Form>
            </AppCard>
          ) : null}
        </div>
      </div>
    </>
  );
}

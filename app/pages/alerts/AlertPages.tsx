import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Form, Link, useFetcher, useNavigation } from "react-router";

import { permissions } from "~/config/permissions";
import { ALERT_DECISION_REASONS } from "~/config/reason-options";
import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { AuditTimeline } from "~/components/ui/AuditTimeline";
import { DataTable } from "~/components/ui/DataTable";
import { DetailSectionCard } from "~/components/ui/DetailSectionCard";
import { FilterBar } from "~/components/ui/FilterBar";
import { FilterSelect } from "~/components/ui/FilterSelect";
import { FormField } from "~/components/ui/FormField";
import { SearchField } from "~/components/ui/SearchField";
import { PreparedMediaSlot } from "~/components/ui/MediaGallery";
import { ReasonComposer } from "~/components/ui/ReasonComposer";
import { AlertSeverityBadge, AlertStatusBadge } from "~/components/ui/StatusBadge";
import { btnFilterSubmit, btnHeaderAction } from "~/components/ui/uiClasses";
import { CsrfField } from "~/components/security/CsrfProvider";
import type {
  Agent,
  AlertDetail,
  AlertItem,
  AlertStatus,
  ListQuery,
  PaginatedResponse,
} from "~/types/admin";
import { ADMIN_ROLE_LABELS } from "~/types/admin";
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

function AssignAlertModal({
  open,
  onClose,
  agents,
  currentAssigneeId,
  fetcher,
}: {
  open: boolean;
  onClose: () => void;
  agents: Agent[];
  currentAssigneeId?: string;
  fetcher: ReturnType<
    typeof useFetcher<{
      ok?: boolean;
      error?: string;
      success?: string;
      alert?: AlertDetail;
    }>
  >;
}) {
  const submitting = fetcher.state !== "idle";

  if (!open) return null;

  return (
    <dialog className="modal modal-open" open aria-labelledby="assign-alert-title">
      <div className="modal-box rounded-3xl">
        <h2 id="assign-alert-title" className="amo-display text-xl font-semibold">
          Affecter l’alerte
        </h2>
        <p className="mt-2 text-sm text-base-content/70">
          Choisissez l’agent responsable de l’analyse. L’alerte passera au statut
          « Affectée ».
        </p>

        {fetcher.data?.ok === false ? (
          <div role="alert" className="alert alert-error mt-4">
            {fetcher.data.error}
          </div>
        ) : null}

        <fetcher.Form method="post" className="mt-5 space-y-4">
          <CsrfField />
          <input type="hidden" name="intent" value="assign" />
          <FormField label="Agent / analyste" htmlFor="assigneeId">
            <select
              id="assigneeId"
              name="assigneeId"
              required
              disabled={submitting}
              defaultValue={currentAssigneeId ?? ""}
              className="amo-select"
            >
              <option value="" disabled>
                Sélectionner un agent…
              </option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.displayName}
                  {agent.establishmentName ? ` · ${agent.establishmentName}` : ""}
                  {` · ${ADMIN_ROLE_LABELS[agent.role] ?? agent.role}`}
                </option>
              ))}
            </select>
          </FormField>
          {agents.length === 0 ? (
            <p className="text-sm text-warning">
              Aucun agent actif disponible pour l’affectation.
            </p>
          ) : null}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost rounded-xl"
              onClick={onClose}
              disabled={submitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary rounded-xl"
              disabled={submitting || agents.length === 0}
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : null}
              Confirmer l’affectation
            </button>
          </div>
        </fetcher.Form>
      </div>
      <button
        type="button"
        className="modal-backdrop"
        aria-label="Fermer"
        onClick={onClose}
        disabled={submitting}
      />
    </dialog>
  );
}

export function AlertDetailPage({
  alert: initialAlert,
  userPermissions,
  assignableAgents = [],
  actionData,
}: {
  alert: AlertDetail;
  userPermissions: string[];
  assignableAgents?: Agent[];
  actionData?: {
    ok?: boolean;
    error?: string;
    success?: string;
    alert?: AlertDetail;
  };
}) {
  const navigation = useNavigation();
  const assignFetcher = useFetcher<{
    ok?: boolean;
    error?: string;
    success?: string;
    alert?: AlertDetail;
  }>();
  const pending = navigation.state !== "idle" || assignFetcher.state !== "idle";
  const latestMutation =
    assignFetcher.data?.ok && assignFetcher.data.alert
      ? assignFetcher.data
      : actionData?.ok && actionData.alert
        ? actionData
        : undefined;
  const alert = latestMutation?.alert ?? initialAlert;
  const flashSuccess =
    (assignFetcher.data?.ok && assignFetcher.data.success) ||
    (actionData?.ok && actionData.success) ||
    undefined;
  const flashError =
    (assignFetcher.data?.ok === false && assignFetcher.data.error) ||
    (actionData?.ok === false && actionData.error) ||
    undefined;
  const [assignOpen, setAssignOpen] = useState(false);
  const canAssign = userPermissions.includes(permissions.alertAssign);
  const canInvestigate = userPermissions.includes(permissions.alertInvestigate);
  const canDecide = userPermissions.includes(permissions.alertDecide);
  const availableStatuses = nextStatuses[alert.status] ?? [];
  const canChangeStatus =
    alert.status === "ASSIGNED" ? canInvestigate : canDecide;
  const canShowAssign =
    canAssign && (alert.status === "NEW" || alert.status === "ASSIGNED");

  useEffect(() => {
    if (assignFetcher.data?.ok) setAssignOpen(false);
  }, [assignFetcher.data]);

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
      {flashError ? (
        <div role="alert" className="alert alert-error mb-5">
          {flashError}
        </div>
      ) : null}
      {flashSuccess ? (
        <div role="status" className="alert alert-success mb-5">
          {flashSuccess}
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
          {canShowAssign ? (
            <AppCard padding="lg">
              <h2 className="amo-display mb-2 text-lg font-semibold text-secondary">
                Affectation
              </h2>
              <p className="mb-4 text-sm text-base-content/65">
                {alert.assignee
                  ? `Actuellement affectée à ${alert.assignee}.`
                  : "Aucun agent n’est encore responsable de cette alerte."}
              </p>
              <button
                type="button"
                className="btn btn-primary h-11 w-full rounded-xl"
                onClick={() => setAssignOpen(true)}
                disabled={pending}
              >
                {alert.assignee ? "Réaffecter" : "Affecter un agent"}
              </button>
            </AppCard>
          ) : null}
          {availableStatuses.length > 0 && canChangeStatus ? (
            <AppCard padding="lg">
              <h2 className="amo-display mb-4 text-lg font-semibold text-secondary">Décision</h2>
              <Form method="post" className="space-y-3">
                <CsrfField />
                <input type="hidden" name="intent" value="status" />
                <FormField label="Nouveau statut">
                  <select name="status" required className="amo-select">
                    {availableStatuses.map((status) => (
                      <option key={status} value={status}>
                        {statuses.find((item) => item.value === status)?.label}
                      </option>
                    ))}
                  </select>
                </FormField>
                <ReasonComposer
                  options={ALERT_DECISION_REASONS}
                  label="Motif de décision"
                  disabled={pending}
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

      <AssignAlertModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        agents={assignableAgents}
        currentAssigneeId={alert.assigneeId}
        fetcher={assignFetcher}
      />
    </>
  );
}

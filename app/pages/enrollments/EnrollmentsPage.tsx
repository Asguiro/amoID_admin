import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link, useNavigation } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { DataTable } from "~/components/ui/DataTable";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { FilterBar } from "~/components/ui/FilterBar";
import { FormField } from "~/components/ui/FormField";
import { SearchField } from "~/components/ui/SearchField";
import { EnrollmentStatusBadge } from "~/components/ui/StatusBadge";
import type { Enrollment, PaginatedResponse } from "~/types/admin";
import { CsrfField } from "~/components/security/CsrfProvider";

const columns: ColumnDef<Enrollment>[] = [
  {
    accessorKey: "beneficiaryName",
    header: "Bénéficiaire",
    cell: ({ row }) => (
      <Link
        className="font-medium text-primary hover:underline"
        to={`/enrollments/${row.original.id}`}
      >
        {row.original.beneficiaryName}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => (
      <EnrollmentStatusBadge status={row.original.status} />
    ),
  },
  { accessorKey: "establishmentName", header: "Établissement" },
  { accessorKey: "submittedBy", header: "Soumis par" },
  {
    accessorKey: "submittedAt",
    header: "Soumis le",
    cell: ({ row }) =>
      new Date(row.original.submittedAt).toLocaleDateString("fr-FR"),
  },
];

export function EnrollmentsPage({
  result,
  q,
  pendingOnly = false,
}: {
  result: PaginatedResponse<Enrollment>;
  q?: string;
  pendingOnly?: boolean;
}) {
  return (
    <>
      <PageHeader
        title={pendingOnly ? "Enrôlements à valider" : "Enrôlements"}
        description="Suivi et traitement des dossiers d’enrôlement."
        actions={
          !pendingOnly ? (
            <Link
              to="/enrollments/pending"
              className="btn btn-primary h-10 rounded-xl"
            >
              Voir la file d’attente
            </Link>
          ) : (
            <Link
              to="/enrollments"
              className="btn btn-ghost h-10 rounded-xl"
            >
              Tous les dossiers
            </Link>
          )
        }
      />
      <Form method="get">
        <FilterBar>
          <SearchField
            defaultValue={q}
            placeholder="Bénéficiaire, identifiant ou établissement"
          />
          <button className="amo-filter-btn" type="submit">
            Rechercher
          </button>
        </FilterBar>
      </Form>
      <DataTable
        className="mt-5"
        columns={columns}
        data={result.items}
        pagination={result.pagination}
        buildPageHref={(page) =>
          `?q=${encodeURIComponent(q ?? "")}&page=${page}`
        }
      />
    </>
  );
}

export function EnrollmentDetailPage({
  enrollment,
  canValidate,
  canReturn,
  actionData,
}: {
  enrollment: Enrollment;
  canValidate: boolean;
  canReturn: boolean;
  actionData?: { error?: string; success?: string };
}) {
  const navigation = useNavigation();
  const busy = navigation.state === "submitting";

  return (
    <>
      <PageHeader
        title={`Enrôlement ${enrollment.id}`}
        description={enrollment.beneficiaryName}
        backTo="/enrollments"
        backLabel="Retour aux enrôlements"
        badge={<EnrollmentStatusBadge status={enrollment.status} />}
      />

      {actionData?.error ? (
        <div role="alert" className="alert alert-error mb-4">
          {actionData.error}
        </div>
      ) : null}
      {actionData?.success ? (
        <div role="status" className="alert alert-success mb-4">
          {actionData.success}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <AppCard padding="lg">
          <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
            Dossier
          </h2>
          <DetailGrid>
            <DetailField label="Établissement">
              {enrollment.establishmentName}
            </DetailField>
            <DetailField label="Soumis par">
              {enrollment.submittedBy}
            </DetailField>
            <DetailField label="Date" className="sm:col-span-2">
              {new Date(enrollment.submittedAt).toLocaleString("fr-FR")}
            </DetailField>
          </DetailGrid>

          <h3 className="mt-8 mb-3 text-sm font-semibold text-secondary">
            Indices de doublon
          </h3>
          {enrollment.duplicateHints.length ? (
            <ul className="space-y-2">
              {enrollment.duplicateHints.map((hint) => (
                <li
                  key={hint}
                  className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning-content"
                >
                  {hint}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-base-content/60">
              Aucun indice détecté.
            </p>
          )}
        </AppCard>

        <AppCard padding="lg">
          <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
            Décision
          </h2>
          {canValidate ? (
            <Form method="post" className="mb-5">
              <CsrfField />
              <button
                disabled={busy}
                name="intent"
                value="validate"
                className="btn btn-success h-11 w-full rounded-xl"
              >
                Valider l’enrôlement
              </button>
            </Form>
          ) : null}
          {canReturn ? (
            <Form method="post" className="space-y-4">
              <CsrfField />
              <FormField label="Commentaire obligatoire">
                <textarea
                  name="comment"
                  required
                  className="amo-textarea"
                />
              </FormField>
              <div className="flex flex-col gap-2">
                <button
                  disabled={busy}
                  name="intent"
                  value="return"
                  className="btn btn-warning h-11 w-full rounded-xl"
                >
                  Retourner pour correction
                </button>
                <button
                  disabled={busy}
                  name="intent"
                  value="manual-review"
                  className="btn btn-outline h-11 w-full rounded-xl"
                >
                  Analyse manuelle
                </button>
              </div>
            </Form>
          ) : null}
          {!canValidate && !canReturn ? (
            <p className="text-sm text-base-content/60">
              Vous ne disposez pas des permissions de décision.
            </p>
          ) : null}
        </AppCard>
      </div>
    </>
  );
}

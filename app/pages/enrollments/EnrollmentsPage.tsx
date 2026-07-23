import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link, useNavigation } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { DataTable } from "~/components/ui/DataTable";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { DetailSectionCard } from "~/components/ui/DetailSectionCard";
import { FilterBar } from "~/components/ui/FilterBar";
import { ReasonComposer } from "~/components/ui/ReasonComposer";
import { SearchField } from "~/components/ui/SearchField";
import {
  MediaGallery,
  PreparedMediaSlot,
  splitDossierMedia,
} from "~/components/ui/MediaGallery";
import { EnrollmentStatusBadge, StatusBadge } from "~/components/ui/StatusBadge";
import { btnFilterSubmit, btnHeaderAction } from "~/components/ui/uiClasses";
import {
  ENROLLMENT_MANUAL_REVIEW_REASONS,
  ENROLLMENT_REJECT_REASONS,
  ENROLLMENT_RETURN_REASONS,
} from "~/config/reason-options";
import type { Enrollment, ListQuery, PaginatedResponse } from "~/types/admin";
import { CsrfField } from "~/components/security/CsrfProvider";
import { enrollmentActionFlags } from "~/utils/enrollment-actions";
import { buildListHref, countActiveListFilters } from "~/utils/search-params";

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
  {
    accessorKey: "isProvisional",
    header: "Type",
    cell: ({ row }) =>
      row.original.isProvisional ? (
        <StatusBadge tone="warning">Provisoire</StatusBadge>
      ) : (
        <StatusBadge tone="neutral">Complet</StatusBadge>
      ),
  },
  {
    accessorKey: "syncStatus",
    header: "Sync",
    cell: ({ row }) =>
      row.original.syncStatus === "PENDING_SYNC" ? (
        <StatusBadge tone="warning">En attente</StatusBadge>
      ) : (
        <StatusBadge tone="success">Synchronisé</StatusBadge>
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
  query,
  pendingOnly = false,
}: {
  result: PaginatedResponse<Enrollment>;
  query: ListQuery;
  pendingOnly?: boolean;
}) {
  const basePath = pendingOnly ? "/enrollments/pending" : "/enrollments";
  return (
    <>
      <PageHeader
        title={pendingOnly ? "Enrôlements à valider" : "Enrôlements"}
        description="Suivi et traitement des dossiers d’enrôlement."
        actions={
          !pendingOnly ? (
            <Link
              to="/enrollments/pending"
              className={btnHeaderAction}
            >
              Voir la file d’attente
            </Link>
          ) : (
            <Link to="/enrollments" className="btn btn-ghost h-10 rounded-xl">
              Tous les dossiers
            </Link>
          )
        }
      />
      <Form method="get">
        <FilterBar
          activeFilterCount={countActiveListFilters(query)}
          resetHref={basePath}
          label="Rechercher dans les enrôlements"
        >
          <SearchField
            defaultValue={query.q}
            placeholder="Bénéficiaire, identifiant ou établissement"
          />
          <button className={btnFilterSubmit} type="submit">
            Rechercher
          </button>
        </FilterBar>
      </Form>
      <DataTable
        className="mt-5"
        columns={columns}
        data={result.items}
        pagination={result.pagination}
        buildPageHref={(page, pageSize = query.pageSize) =>
          buildListHref(basePath, query, { page, pageSize })
        }
      />
    </>
  );
}

const qualityLabels = {
  GOOD: "Bonne",
  ACCEPTABLE: "Acceptable",
  POOR: "Faible",
} as const;

function EnrollmentMediaSection({ enrollment }: { enrollment: Enrollment }) {
  const { galleryAssets, restrictedFace } = splitDossierMedia(enrollment.media);
  const hasAnyMedia = (enrollment.media?.length ?? 0) > 0;

  if (!hasAnyMedia) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <PreparedMediaSlot
          label="Capture faciale"
          kind="FACE_CAPTURE"
          referenceId={enrollment.faceCaptureSessionId}
          availability={
            enrollment.faceCaptureSessionId ? "RESTRICTED" : "MISSING"
          }
        />
        <PreparedMediaSlot
          label="Pièces du dossier"
          kind="ID_DOCUMENT"
          availability="MISSING"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {galleryAssets.length > 0 ? <MediaGallery assets={galleryAssets} /> : null}
      {restrictedFace ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <PreparedMediaSlot
            label={restrictedFace.label || "Capture faciale"}
            kind="FACE_CAPTURE"
            referenceId={
              restrictedFace.referenceId ?? enrollment.faceCaptureSessionId
            }
            availability="RESTRICTED"
          />
        </div>
      ) : null}
    </div>
  );
}

export function EnrollmentDetailPage({
  enrollment: initialEnrollment,
  permissions: userPermissions,
  actionData,
}: {
  enrollment: Enrollment;
  permissions: string[];
  canValidate?: boolean;
  canReturn?: boolean;
  canReject?: boolean;
  actionData?: {
    error?: string;
    success?: string;
    enrollment?: Enrollment;
  };
}) {
  const navigation = useNavigation();
  const busy = navigation.state === "submitting";
  const enrollment = actionData?.enrollment ?? initialEnrollment;
  const { canValidate, canReturn, canReject } = enrollmentActionFlags(
    enrollment,
    userPermissions,
  );
  const canDecide = canValidate || canReturn || canReject;
  const terminal =
    enrollment.status === "VALIDATED" || enrollment.status === "REJECTED";

  return (
    <>
      <PageHeader
        title={`Enrôlement ${enrollment.id}`}
        description={`${enrollment.beneficiaryName} · ${enrollment.establishmentName} · soumis par ${enrollment.submittedBy}`}
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
        <div className="space-y-5">
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
              <DetailField label="Type">
                {enrollment.isProvisional ? "Provisoire" : "Complet"}
              </DetailField>
              <DetailField label="Synchronisation">
                {enrollment.syncStatus === "PENDING_SYNC"
                  ? "En attente de sync"
                  : "Synchronisé"}
              </DetailField>
              <DetailField label="Consentement santé">
                {enrollment.healthConsentAccepted ? "Accepté" : "Non / N/A"}
              </DetailField>
              <DetailField label="Qualité capture">
                {enrollment.faceQualityLabel
                  ? qualityLabels[enrollment.faceQualityLabel]
                  : "—"}
              </DetailField>
              <DetailField label="Session face" className="sm:col-span-2">
                {enrollment.faceCaptureSessionId ?? "—"}
              </DetailField>
              <DetailField label="Date" className="sm:col-span-2">
                {new Date(enrollment.submittedAt).toLocaleString("fr-FR")}
              </DetailField>
              {enrollment.returnReason ? (
                <DetailField label="Motif enregistré" className="sm:col-span-2">
                  {enrollment.returnReason}
                </DetailField>
              ) : null}
            </DetailGrid>
          </AppCard>

          <DetailSectionCard
            title="Captures et documents"
            description="Les contenus biométriques restent protégés et ne sont chargés qu’avec une autorisation adaptée."
            badge={<span className="badge badge-outline">Données sensibles</span>}
          >
            <EnrollmentMediaSection enrollment={enrollment} />
          </DetailSectionCard>

          {enrollment.requiredFields ? (
            <AppCard padding="lg">
              <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
                Champs saisis
              </h2>
              <DetailGrid>
                <DetailField label="Prénom">
                  {enrollment.requiredFields.firstName || "—"}
                </DetailField>
                <DetailField label="Nom">
                  {enrollment.requiredFields.lastName || "—"}
                </DetailField>
                <DetailField label="Naissance">
                  {enrollment.requiredFields.birthDate || "—"}
                </DetailField>
                <DetailField label="Sexe">
                  {enrollment.requiredFields.sex === "FEMALE"
                    ? "Féminin"
                    : enrollment.requiredFields.sex === "MALE"
                      ? "Masculin"
                      : "—"}
                </DetailField>
                <DetailField label="Téléphone">
                  {enrollment.requiredFields.phoneCountryCode}{" "}
                  {enrollment.requiredFields.phoneNumber || "—"}
                </DetailField>
                <DetailField label="Ville">
                  {enrollment.requiredFields.city || "—"}
                </DetailField>
                <DetailField label="Adresse" className="sm:col-span-2">
                  {enrollment.requiredFields.address || "—"}
                </DetailField>
                <DetailField label="NINA">
                  {enrollment.requiredFields.ninaMasked || "—"}
                </DetailField>
                <DetailField label="Carte biométrique">
                  {enrollment.requiredFields.biometricCardNumberMasked || "—"}
                </DetailField>
              </DetailGrid>
            </AppCard>
          ) : null}

          {enrollment.healthSummary ? (
            <AppCard padding="lg">
              <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
                Santé (présence)
              </h2>
              <DetailGrid columns={3}>
                <DetailField label="Contact urgence">
                  {enrollment.healthSummary.hasEmergencyContact ? "Oui" : "Non"}
                </DetailField>
                <DetailField label="Groupe sanguin">
                  {enrollment.healthSummary.hasBloodGroup ? "Oui" : "Non"}
                </DetailField>
                <DetailField label="Allergies">
                  {enrollment.healthSummary.hasAllergies ? "Oui" : "Non"}
                </DetailField>
              </DetailGrid>
            </AppCard>
          ) : null}

          <AppCard padding="lg">
            <h3 className="mb-3 text-sm font-semibold text-secondary">
              Indices de doublon
            </h3>
            {enrollment.duplicateCandidates?.length ? (
              <ul className="space-y-2">
                {enrollment.duplicateCandidates.map((candidate) => (
                  <li
                    key={candidate.beneficiaryId}
                    className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm"
                  >
                    <Link
                      className="font-medium text-primary hover:underline"
                      to={`/beneficiaries/${candidate.beneficiaryId}`}
                    >
                      {candidate.displayName}
                    </Link>
                    <p className="mt-1 text-warning-content">{candidate.hint}</p>
                  </li>
                ))}
              </ul>
            ) : enrollment.duplicateHints.length ? (
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
        </div>

        <AppCard padding="lg">
          <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
            Décision
          </h2>

          {terminal ? (
            <p className="text-sm text-base-content/70">
              Ce dossier est déjà{" "}
              {enrollment.status === "VALIDATED" ? "validé" : "rejeté"}. Aucune
              nouvelle décision n’est possible.
            </p>
          ) : null}

          {!terminal && enrollment.status === "RETURNED" && !canReject ? (
            <p className="mb-4 text-sm text-base-content/70">
              Dossier retourné pour correction — en attente d’une nouvelle
              soumission.
            </p>
          ) : null}

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
            <Form
              method="post"
              className="mb-5 space-y-4 border-t border-base-200 pt-5"
            >
              <CsrfField />
              <ReasonComposer
                options={ENROLLMENT_RETURN_REASONS}
                label="Motif de retour"
                disabled={busy}
              />
              <button
                disabled={busy}
                name="intent"
                value="return"
                className="btn btn-warning h-11 w-full rounded-xl"
              >
                Retourner pour correction
              </button>
            </Form>
          ) : null}

          {canReturn ? (
            <Form
              method="post"
              className="mb-5 space-y-4 border-t border-base-200 pt-5"
            >
              <CsrfField />
              <ReasonComposer
                options={ENROLLMENT_MANUAL_REVIEW_REASONS}
                label="Motif d’analyse manuelle"
                disabled={busy}
              />
              <button
                disabled={busy}
                name="intent"
                value="manual-review"
                className="btn btn-outline h-11 w-full rounded-xl"
              >
                Demander une analyse manuelle
              </button>
            </Form>
          ) : null}

          {canReject ? (
            <Form
              method="post"
              className="space-y-4 border-t border-base-200 pt-5"
            >
              <CsrfField />
              <ReasonComposer
                options={ENROLLMENT_REJECT_REASONS}
                label="Motif de rejet"
                disabled={busy}
              />
              <button
                disabled={busy}
                name="intent"
                value="reject"
                className="btn btn-error h-11 w-full rounded-xl"
              >
                Rejeter l’enrôlement
              </button>
            </Form>
          ) : null}

          {!canDecide && !terminal ? (
            <p className="text-sm text-base-content/60">
              Aucune action disponible pour ce statut, ou permissions
              insuffisantes.
            </p>
          ) : null}
        </AppCard>
      </div>
    </>
  );
}

import type { ColumnDef } from "@tanstack/react-table";
import { Form, Link } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { AuditTimeline } from "~/components/ui/AuditTimeline";
import { DataTable } from "~/components/ui/DataTable";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { DetailSectionCard } from "~/components/ui/DetailSectionCard";
import { FilterBar } from "~/components/ui/FilterBar";
import { FilterSelect } from "~/components/ui/FilterSelect";
import { SearchField } from "~/components/ui/SearchField";
import { PreparedMediaSlot } from "~/components/ui/MediaGallery";
import { SensitiveDataReveal } from "~/components/ui/SensitiveDataReveal";
import { StatusBadge } from "~/components/ui/StatusBadge";
import type {
  Beneficiary,
  BeneficiaryCoverageStatus,
  BeneficiaryDetail,
  ListQuery,
  PaginatedResponse,
} from "~/types/admin";
import { buildListHref, countActiveListFilters } from "~/utils/search-params";

const coverageLabels: Record<BeneficiaryCoverageStatus, string> = {
  ACTIVE: "Droits actifs",
  SUSPENDED: "Droits suspendus",
  UPDATE_REQUIRED: "Mise à jour requise",
  NOT_FOUND: "Introuvable",
};

function coverageTone(status: BeneficiaryCoverageStatus) {
  if (status === "ACTIVE") return "success" as const;
  if (status === "SUSPENDED" || status === "NOT_FOUND") return "error" as const;
  return "warning" as const;
}

const beneficiaryColumns: ColumnDef<Beneficiary>[] = [
  {
    accessorKey: "displayName",
    header: "Bénéficiaire",
    cell: ({ row }) => (
      <Link
        className="font-medium text-primary hover:underline"
        to={`/beneficiaries/${row.original.id}`}
      >
        {row.original.displayName}
      </Link>
    ),
  },
  { accessorKey: "ninaMasked", header: "NINA" },
  { accessorKey: "amoNumberMasked", header: "N° AMO" },
  {
    accessorKey: "beneficiaryType",
    header: "Type",
    cell: ({ row }) =>
      row.original.beneficiaryType === "PRIMARY" ? "Ouvrant droit" : "Ayant droit",
  },
  {
    accessorKey: "dossierStatus",
    header: "Complétude",
    cell: ({ row }) => (
      <StatusBadge
        tone={row.original.dossierStatus === "COMPLETE" ? "success" : "warning"}
      >
        {row.original.dossierStatus === "COMPLETE" ? "Complet" : "Incomplet"}
      </StatusBadge>
    ),
  },
  {
    accessorKey: "coverageStatus",
    header: "Couverture",
    cell: ({ row }) => (
      <StatusBadge tone={coverageTone(row.original.coverageStatus)}>
        {coverageLabels[row.original.coverageStatus]}
      </StatusBadge>
    ),
  },
  { accessorKey: "establishmentName", header: "Établissement" },
  {
    accessorKey: "lastVerifiedAt",
    header: "Dernière vérif.",
    cell: ({ row }) =>
      row.original.lastVerifiedAt
        ? new Date(row.original.lastVerifiedAt).toLocaleDateString("fr-FR")
        : "—",
  },
];

export function BeneficiariesPage({
  result,
  query,
}: {
  result: PaginatedResponse<Beneficiary>;
  query: ListQuery;
}) {
  return (
    <>
      <PageHeader
        title="Bénéficiaires"
        description="Recherche et consultation des dossiers bénéficiaires."
      />
      <Form method="get">
        <FilterBar
          activeFilterCount={countActiveListFilters(query)}
          resetHref="/beneficiaries"
          label="Rechercher et filtrer les bénéficiaires"
        >
          <SearchField
            defaultValue={query.q}
            placeholder="Nom, NINA, AMO ou carte biométrique"
          />
          <FilterSelect
            name="coverageStatus"
            value={query.coverageStatus}
            label="Filtrer par couverture"
            allLabel="Toute couverture"
            options={[
              { value: "ACTIVE", label: "Droits actifs" },
              { value: "SUSPENDED", label: "Suspendus" },
              { value: "UPDATE_REQUIRED", label: "Mise à jour requise" },
              { value: "NOT_FOUND", label: "Introuvable" },
            ]}
          />
          <FilterSelect
            name="dossierStatus"
            value={query.dossierStatus}
            label="Filtrer par complétude"
            allLabel="Toute complétude"
            options={[
              { value: "COMPLETE", label: "Complet" },
              { value: "INCOMPLETE", label: "Incomplet" },
            ]}
          />
          <FilterSelect
            name="beneficiaryType"
            value={query.beneficiaryType}
            label="Filtrer par type"
            allLabel="Tous les types"
            options={[
              { value: "PRIMARY", label: "Ouvrant droit" },
              { value: "DEPENDENT", label: "Ayant droit" },
            ]}
          />
          <button className="btn btn-primary h-11 rounded-2xl px-5" type="submit">
            Filtrer
          </button>
        </FilterBar>
      </Form>
      <DataTable
        className="mt-5"
        columns={beneficiaryColumns}
        data={result.items}
        pagination={result.pagination}
        buildPageHref={(page, pageSize = query.pageSize) =>
          buildListHref("/beneficiaries", query, { page, pageSize })
        }
      />
    </>
  );
}

export function BeneficiaryDetailPage({
  beneficiary,
  canReveal,
  canReadHealth,
  sensitive,
}: {
  beneficiary: BeneficiaryDetail;
  canReveal: boolean;
  canReadHealth: boolean;
  sensitive?: {
    nina?: string;
    amoNumber?: string;
    biometricCardNumber?: string;
  };
}) {
  return (
    <>
      <PageHeader
        title={beneficiary.displayName}
        description={`${beneficiary.beneficiaryType === "PRIMARY" ? "Ouvrant droit" : "Ayant droit"} · ${beneficiary.establishmentName} · ${beneficiary.region}`}
        backTo="/beneficiaries"
        backLabel="Retour aux bénéficiaires"
        badge={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={coverageTone(beneficiary.coverageStatus)}>
              {coverageLabels[beneficiary.coverageStatus]}
            </StatusBadge>
            <StatusBadge tone={beneficiary.hasBiometrics ? "success" : "neutral"}>
              {beneficiary.hasBiometrics ? "Biométrie présente" : "Sans biométrie"}
            </StatusBadge>
          </div>
        }
        actions={
          <>
            <Link className="btn btn-outline h-10 rounded-xl" to="activity">
              Activité
            </Link>
            <Link className="btn btn-outline h-10 rounded-xl" to="coverage">
              Couverture
            </Link>
            <Link className="btn btn-outline h-10 rounded-xl" to="temporary-qr">
              QR temporaires
            </Link>
            {beneficiary.dossierStatus === "INCOMPLETE" ? (
              <Link
                className="btn btn-warning h-10 rounded-xl"
                to={`/enrollments?q=${encodeURIComponent(beneficiary.displayName)}`}
              >
                Demander correction
              </Link>
            ) : null}
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <AppCard padding="lg">
          <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
            Identité
          </h2>
          <div className="space-y-3">
            <SensitiveDataReveal
              label="NINA"
              maskedValue={beneficiary.ninaMasked}
              revealedValue={sensitive?.nina}
              canReveal={canReveal}
            />
            <SensitiveDataReveal
              label="Numéro AMO"
              maskedValue={beneficiary.amoNumberMasked}
              revealedValue={sensitive?.amoNumber}
              canReveal={canReveal}
            />
            <SensitiveDataReveal
              label="Carte biométrique"
              maskedValue={beneficiary.biometricCardNumberMasked}
              revealedValue={sensitive?.biometricCardNumber}
              canReveal={canReveal}
            />
            <DetailGrid>
              <DetailField label="Téléphone">
                {beneficiary.phoneMasked}
              </DetailField>
              <DetailField label="Date de naissance">
                {beneficiary.dateOfBirth ?? "—"}
              </DetailField>
              <DetailField label="Sexe">
                {beneficiary.sex === "FEMALE"
                  ? "Féminin"
                  : beneficiary.sex === "MALE"
                    ? "Masculin"
                    : "—"}
              </DetailField>
              <DetailField label="Ville">{beneficiary.city ?? "—"}</DetailField>
              <DetailField label="Adresse" className="sm:col-span-2">
                {beneficiary.address ?? "—"}
              </DetailField>
            </DetailGrid>
          </div>
        </AppCard>

        <AppCard padding="lg">
          <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
            Situation
          </h2>
          <DetailGrid>
            <DetailField label="Type">
              {beneficiary.beneficiaryType === "PRIMARY"
                ? "Ouvrant droit"
                : "Ayant droit"}
            </DetailField>
            <DetailField label="Complétude">
              {beneficiary.dossierStatus === "COMPLETE" ? "Complet" : "Incomplet"}
            </DetailField>
            <DetailField label="Couverture">
              {coverageLabels[beneficiary.coverageStatus]}
            </DetailField>
            <DetailField label="Biométrie">
              {beneficiary.hasBiometrics ? "Présente" : "Absente"}
            </DetailField>
            <DetailField label="Dernière vérification">
              {beneficiary.lastVerifiedAt
                ? new Date(beneficiary.lastVerifiedAt).toLocaleString("fr-FR")
                : "—"}
            </DetailField>
            <DetailField label="Mise à jour">
              {new Date(beneficiary.updatedAt).toLocaleString("fr-FR")}
            </DetailField>
            {beneficiary.primaryHolderName ? (
              <DetailField label="Ouvrant droit" className="sm:col-span-2">
                {beneficiary.primaryHolderId ? (
                  <Link
                    className="text-primary hover:underline"
                    to={`/beneficiaries/${beneficiary.primaryHolderId}`}
                  >
                    {beneficiary.primaryHolderName}
                  </Link>
                ) : (
                  beneficiary.primaryHolderName
                )}
              </DetailField>
            ) : null}
          </DetailGrid>
        </AppCard>

        <DetailSectionCard
          className="lg:col-span-2"
          title="Photos et documents"
          description="Emplacements préparés pour le portrait, les captures et les justificatifs du dossier."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PreparedMediaSlot label="Portrait bénéficiaire" kind="PORTRAIT" />
            <PreparedMediaSlot
              label="Capture biométrique"
              kind="FACE_CAPTURE"
              availability={beneficiary.hasBiometrics ? "RESTRICTED" : "MISSING"}
            />
            <PreparedMediaSlot label="Documents d’identité" kind="ID_DOCUMENT" />
          </div>
        </DetailSectionCard>

        {canReadHealth && beneficiary.hasHealthInfo && beneficiary.healthSummary ? (
          <AppCard padding="lg" className="lg:col-span-2">
            <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
              Santé d’urgence (résumé)
            </h2>
            <DetailGrid columns={3}>
              <DetailField label="Consentement">
                {beneficiary.healthSummary.consentAccepted ? "Accepté" : "Non"}
              </DetailField>
              <DetailField label="Contact d’urgence">
                {beneficiary.healthSummary.hasEmergencyContact ? "Renseigné" : "Absent"}
              </DetailField>
              <DetailField label="Groupe sanguin">
                {beneficiary.healthSummary.hasBloodGroup ? "Renseigné" : "Absent"}
              </DetailField>
              <DetailField label="Allergies">
                {beneficiary.healthSummary.hasAllergies ? "Déclarées" : "Aucune"}
              </DetailField>
              <DetailField label="Chroniques">
                {beneficiary.healthSummary.hasChronicConditions
                  ? "Déclarées"
                  : "Aucune"}
              </DetailField>
              <DetailField label="Traitements">
                {beneficiary.healthSummary.hasTreatments ? "Déclarés" : "Aucun"}
              </DetailField>
            </DetailGrid>
            <p className="mt-4 text-xs text-base-content/50">
              Les détails médicaux bruts ne sont pas exposés dans cette vue.
            </p>
          </AppCard>
        ) : null}
      </div>
    </>
  );
}

export function BeneficiaryActivityPage({
  beneficiary,
}: {
  beneficiary: BeneficiaryDetail;
}) {
  return (
    <>
      <PageHeader
        title={`Activité — ${beneficiary.displayName}`}
        backTo={`/beneficiaries/${beneficiary.id}`}
        backLabel="Retour au dossier"
      />
      <AppCard padding="lg">
        <AuditTimeline items={beneficiary.activity} />
      </AppCard>
    </>
  );
}

export function BeneficiaryCoveragePage({
  beneficiary,
}: {
  beneficiary: BeneficiaryDetail;
}) {
  return (
    <>
      <PageHeader
        title={`Couverture — ${beneficiary.displayName}`}
        backTo={`/beneficiaries/${beneficiary.id}`}
        backLabel="Retour au dossier"
      />
      <AppCard padding="lg">
        <div className="space-y-3">
          {beneficiary.coverageHistory.map((coverage) => (
            <div
              key={coverage.id}
              className="rounded-2xl bg-base-200/80 px-5 py-4"
            >
              <p className="font-medium text-secondary">{coverage.label}</p>
              <p className="mt-1 text-sm text-base-content/60">
                Du {coverage.from} au {coverage.to} ·{" "}
                {coverageLabels[coverage.status as BeneficiaryCoverageStatus] ??
                  coverage.status}
              </p>
            </div>
          ))}
        </div>
      </AppCard>
    </>
  );
}

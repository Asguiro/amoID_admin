import { Link } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { StatusBadge } from "~/components/ui/StatusBadge";
import type { Establishment } from "~/types/admin";

const typeLabels = {
  HOSPITAL: "Hôpital",
  CLINIC: "Clinique",
  PHARMACY: "Pharmacie",
  ANTENNA: "Antenne",
};

export function EstablishmentDetailPage({
  establishment,
}: {
  establishment: Establishment;
}) {
  return (
    <>
      <PageHeader
        title={establishment.name}
        description="Fiche de l’établissement"
        backTo="/establishments"
        backLabel="Retour aux établissements"
        badge={
          <StatusBadge
            tone={establishment.status === "ACTIVE" ? "success" : "neutral"}
          >
            {establishment.status === "ACTIVE" ? "Actif" : "Inactif"}
          </StatusBadge>
        }
        actions={
          <Link
            className="btn btn-primary h-10 rounded-xl"
            to={`/establishments/${establishment.id}/edit`}
          >
            Modifier
          </Link>
        }
      />

      <AppCard className="max-w-4xl" padding="lg">
        <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
          Informations
        </h2>
        <DetailGrid>
          <DetailField label="Type">
            {typeLabels[establishment.type]}
          </DetailField>
          <DetailField label="Région">{establishment.region}</DetailField>
          <DetailField label="Ville">{establishment.city}</DetailField>
          <DetailField label="Agents">
            {String(establishment.agentsCount)}
          </DetailField>
          <DetailField label="Appareils">
            {String(establishment.devicesCount)}
          </DetailField>
          <DetailField label="Dernière mise à jour">
            {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
              new Date(establishment.updatedAt),
            )}
          </DetailField>
        </DetailGrid>
      </AppCard>
    </>
  );
}

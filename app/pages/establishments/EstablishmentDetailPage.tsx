import { Link } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { DetailSectionCard } from "~/components/ui/DetailSectionCard";
import { PreparedMediaSlot } from "~/components/ui/MediaGallery";
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
        description={`${typeLabels[establishment.type]} · ${establishment.city} · ${establishment.region}`}
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

      <div className="grid max-w-5xl gap-5 lg:grid-cols-[1fr_18rem]">
      <DetailSectionCard title="Informations">
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
      </DetailSectionCard>
      <DetailSectionCard title="Identité visuelle">
        <PreparedMediaSlot label="Logo ou photo de l’établissement" kind="OTHER" />
      </DetailSectionCard>
      </div>
    </>
  );
}

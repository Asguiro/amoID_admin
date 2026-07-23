import { Form, Link, useNavigation } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { DetailSectionCard } from "~/components/ui/DetailSectionCard";
import { FormField } from "~/components/ui/FormField";
import { PreparedMediaSlot } from "~/components/ui/MediaGallery";
import { StatusBadge } from "~/components/ui/StatusBadge";
import { CsrfField } from "~/components/security/CsrfProvider";
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
  const navigation = useNavigation();
  const busy = navigation.state !== "idle";
  const inactive = establishment.status === "INACTIVE";

  return (
    <>
      <PageHeader
        title={establishment.name}
        description={`${typeLabels[establishment.type]} · ${establishment.city} · ${establishment.region}`}
        backTo="/establishments"
        backLabel="Retour aux établissements"
        badge={
          <StatusBadge tone={inactive ? "neutral" : "success"}>
            {inactive ? "Inactif" : "Actif"}
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

          <Form
            method="post"
            className="mt-8 space-y-4 border-t border-base-200 pt-6"
          >
            <CsrfField />
            <FormField label="Motif de l’action">
              <textarea
                required
                name="reason"
                className="amo-textarea"
                placeholder="Saisissez un motif…"
                minLength={3}
              />
            </FormField>
            <button
              disabled={busy}
              name="intent"
              value={inactive ? "reactivate" : "suspend"}
              className={`btn h-11 rounded-xl ${
                inactive ? "btn-success" : "btn-error"
              }`}
              type="submit"
            >
              {inactive
                ? "Réactiver l’établissement"
                : "Suspendre l’établissement"}
            </button>
          </Form>
        </DetailSectionCard>
        <DetailSectionCard title="Identité visuelle">
          <PreparedMediaSlot
            label="Logo ou photo de l’établissement"
            kind="OTHER"
          />
        </DetailSectionCard>
      </div>
    </>
  );
}

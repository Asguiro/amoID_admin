import { Form, Link, useNavigation } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { FormField } from "~/components/ui/FormField";
import type { Establishment } from "~/types/admin";
import { CsrfField } from "~/components/security/CsrfProvider";

export function EstablishmentFormPage({
  establishment,
}: {
  establishment?: Establishment;
}) {
  const navigation = useNavigation();
  const busy = navigation.state !== "idle";
  const editing = Boolean(establishment);

  return (
    <>
      <PageHeader
        title={editing ? "Modifier l’établissement" : "Nouvel établissement"}
        description="Renseignez les informations administratives de la structure."
        backTo={
          establishment
            ? `/establishments/${establishment.id}`
            : "/establishments"
        }
        backLabel={editing ? "Retour à la fiche" : "Retour aux établissements"}
      />

      <AppCard className="max-w-3xl" padding="lg">
        <Form method="post" className="grid gap-5 sm:grid-cols-2">
          <CsrfField />
          <FormField label="Nom" className="sm:col-span-2">
            <input
              required
              name="name"
              defaultValue={establishment?.name}
              className="amo-input"
            />
          </FormField>
          <FormField label="Type">
            <select
              name="type"
              defaultValue={establishment?.type ?? "HOSPITAL"}
              className="amo-select"
            >
              <option value="HOSPITAL">Hôpital</option>
              <option value="CLINIC">Clinique</option>
              <option value="PHARMACY">Pharmacie</option>
              <option value="ANTENNA">Antenne</option>
            </select>
          </FormField>
          <FormField label="Statut">
            <select
              name="status"
              defaultValue={establishment?.status ?? "ACTIVE"}
              className="amo-select"
            >
              <option value="ACTIVE">Actif</option>
              <option value="INACTIVE">Inactif</option>
            </select>
          </FormField>
          <FormField label="Région">
            <input
              required
              name="region"
              defaultValue={establishment?.region}
              className="amo-input"
            />
          </FormField>
          <FormField label="Ville">
            <input
              required
              name="city"
              defaultValue={establishment?.city}
              className="amo-input"
            />
          </FormField>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-base-200 pt-5 sm:col-span-2">
            <Link
              className="btn btn-ghost h-11 rounded-xl"
              to={
                establishment
                  ? `/establishments/${establishment.id}`
                  : "/establishments"
              }
            >
              Annuler
            </Link>
            <button
              disabled={busy}
              className="btn btn-primary h-11 rounded-xl px-6"
              type="submit"
            >
              {busy ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </Form>
      </AppCard>
    </>
  );
}

import { Form, Link, useNavigation } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { FormField } from "~/components/ui/FormField";
import { CsrfField } from "~/components/security/CsrfProvider";
import type { Establishment } from "~/types/admin";
import type { RegionOption } from "~/services/establishments/establishments.service";

export function EstablishmentFormPage({
  establishment,
  regions,
}: {
  establishment?: Establishment;
  regions: RegionOption[];
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
          {editing ? (
            <FormField label="Région">
              <input
                readOnly
                value={establishment?.region ?? ""}
                className="amo-input"
              />
            </FormField>
          ) : (
            <FormField label="Région">
              <select
                required
                name="regionId"
                defaultValue=""
                className="amo-select"
              >
                <option value="" disabled>
                  Sélectionner une région
                </option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name} ({region.code})
                  </option>
                ))}
              </select>
            </FormField>
          )}
          <FormField label="Ville" className={editing ? "sm:col-span-2" : undefined}>
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

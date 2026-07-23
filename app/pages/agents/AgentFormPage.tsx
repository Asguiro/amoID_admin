import { Form, Link, useNavigation } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { FormField } from "~/components/ui/FormField";
import type { Agent, Establishment } from "~/types/admin";
import { ADMIN_ROLE_LABELS } from "~/types/admin";
import { adminRoles } from "~/config/permissions";
import { CsrfField } from "~/components/security/CsrfProvider";

export function AgentFormPage({
  agent,
  establishments,
}: {
  agent?: Agent;
  establishments: Establishment[];
}) {
  const navigation = useNavigation();
  const busy = navigation.state !== "idle";

  return (
    <>
      <PageHeader
        title={agent ? "Modifier l’agent" : "Nouvel agent"}
        description="Configurez l’identité, le rôle et le rattachement de l’agent."
        backTo={agent ? `/agents/${agent.id}` : "/agents"}
        backLabel={agent ? "Retour à la fiche" : "Retour aux agents"}
      />

      <AppCard className="max-w-3xl" padding="lg">
        <Form method="post" className="grid gap-5 sm:grid-cols-2">
          <CsrfField />
          <FormField label="Nom complet">
            <input
              required
              name="displayName"
              defaultValue={agent?.displayName}
              className="amo-input"
            />
          </FormField>
          <FormField label="Courriel">
            <input
              required
              type="email"
              name="email"
              defaultValue={agent?.email}
              className="amo-input"
            />
          </FormField>
          {!agent ? (
            <FormField label="Mot de passe initial">
              <input
                required
                type="password"
                name="password"
                minLength={8}
                defaultValue="Demo@2026!"
                className="amo-input"
                autoComplete="new-password"
              />
            </FormField>
          ) : null}
          <FormField label="Rôle">
            <select
              required
              name="role"
              defaultValue={agent?.role ?? adminRoles.ENROLLMENT_AGENT}
              className="amo-select"
            >
              {Object.values(adminRoles).map((role) => (
                <option key={role} value={role}>
                  {ADMIN_ROLE_LABELS[role] ?? role}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Statut">
            <select
              name="status"
              defaultValue={agent?.status ?? "PENDING"}
              className="amo-select"
            >
              <option value="PENDING">En attente</option>
              <option value="ACTIVE">Actif</option>
              <option value="SUSPENDED">Suspendu</option>
              <option value="ARCHIVED">Archivé</option>
            </select>
          </FormField>
          <FormField label="Établissement" className="sm:col-span-2">
            <select
              required
              name="establishment"
              defaultValue={
                agent
                  ? `${agent.establishmentId}|${agent.establishmentName}|${agent.region}`
                  : ""
              }
              className="amo-select"
            >
              <option value="" disabled>
                Sélectionner un établissement
              </option>
              {establishments.map((item) => (
                <option
                  key={item.id}
                  value={`${item.id}|${item.name}|${item.region}`}
                >
                  {item.name} — {item.region}
                </option>
              ))}
            </select>
          </FormField>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-base-200 pt-5 sm:col-span-2">
            <Link
              className="btn btn-ghost h-11 rounded-xl"
              to={agent ? `/agents/${agent.id}` : "/agents"}
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

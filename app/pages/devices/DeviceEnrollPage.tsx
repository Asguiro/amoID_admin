import { Form, Link, useNavigation } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { FormField } from "~/components/ui/FormField";
import {
  btnFormCancel,
  btnFormSubmit,
  formFooterRow,
} from "~/components/ui/uiClasses";
import { CsrfField } from "~/components/security/CsrfProvider";
import type { Agent } from "~/types/admin";

export function DeviceEnrollPage({
  agents,
  preselectedAgentId,
  actionData,
}: {
  agents: Agent[];
  preselectedAgentId?: string;
  actionData?: { error?: string };
}) {
  const navigation = useNavigation();
  const busy = navigation.state !== "idle";

  return (
    <>
      <PageHeader
        title="Enrôler un appareil"
        description="Créez un terminal de confiance pour un agent, sans passer par la demande mobile. L’identifiant doit correspondre au deviceId de l’app."
        backTo="/devices"
        backLabel="Retour aux appareils"
      />

      {actionData?.error ? (
        <div role="alert" className="alert alert-error mb-4 max-w-3xl">
          {actionData.error}
        </div>
      ) : null}

      <AppCard className="max-w-3xl" padding="lg">
        <Form method="post" className="grid gap-5 sm:grid-cols-2">
          <CsrfField />
          <FormField label="Identifiant appareil (deviceId)" className="sm:col-span-2">
            <input
              required
              name="deviceId"
              minLength={3}
              placeholder="ex. amo-android-xxxxxxxx-xxxx-4xxx-…"
              className="amo-input font-mono text-sm"
              autoComplete="off"
            />
          </FormField>
          <FormField label="Libellé">
            <input
              name="label"
              placeholder="Terminal terrain Bamako"
              className="amo-input"
            />
          </FormField>
          <FormField label="Plateforme">
            <select name="platform" defaultValue="android" className="amo-select">
              <option value="android">Android</option>
              <option value="ios">iOS</option>
            </select>
          </FormField>
          <FormField label="Agent" className="sm:col-span-2">
            <select
              required
              name="agentId"
              defaultValue={preselectedAgentId ?? ""}
              className="amo-select"
            >
              <option value="" disabled>
                Sélectionner un agent…
              </option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.displayName} · {agent.email}
                </option>
              ))}
            </select>
          </FormField>
          <div className={formFooterRow}>
            <Link to="/devices" className={btnFormCancel}>
              Annuler
            </Link>
            <button className={btnFormSubmit} type="submit" disabled={busy}>
              {busy ? "Enrôlement…" : "Enrôler (TRUSTED)"}
            </button>
          </div>
        </Form>
      </AppCard>
    </>
  );
}

import { Form, Link, useNavigation } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { AuditTimeline } from "~/components/ui/AuditTimeline";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { FormField } from "~/components/ui/FormField";
import { AgentStatusBadge } from "~/components/ui/StatusBadge";
import type { Agent } from "~/types/admin";
import { CsrfField } from "~/components/security/CsrfProvider";

export function AgentDetailPage({ agent }: { agent: Agent }) {
  const navigation = useNavigation();
  const busy = navigation.state !== "idle";
  const activity = [
    {
      id: "act-1",
      label: "Dernière activité enregistrée",
      actor: agent.displayName,
      createdAt: agent.lastActiveAt,
    },
    {
      id: "act-2",
      label: "Compte agent créé",
      actor: "Administration AMO ID",
      createdAt: agent.createdAt,
    },
  ];

  return (
    <>
      <PageHeader
        title={agent.displayName}
        description={agent.role}
        backTo="/agents"
        backLabel="Retour aux agents"
        badge={<AgentStatusBadge status={agent.status} />}
        actions={
          <>
            <Link
              className="btn btn-outline h-10 rounded-xl"
              to={`/agents/${agent.id}/devices`}
            >
              Voir les appareils
            </Link>
            <Link
              className="btn btn-primary h-10 rounded-xl"
              to={`/agents/${agent.id}/edit`}
            >
              Modifier
            </Link>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <AppCard className="lg:col-span-2" padding="lg">
          <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
            Identité
          </h2>
          <DetailGrid>
            <DetailField label="Courriel">{agent.email}</DetailField>
            <DetailField label="Établissement">
              {agent.establishmentName}
            </DetailField>
            <DetailField label="Région">{agent.region}</DetailField>
            <DetailField label="Identifiant" mono>
              {agent.id}
            </DetailField>
          </DetailGrid>

          {agent.status !== "ARCHIVED" ? (
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
                />
              </FormField>
              <button
                disabled={busy}
                name="intent"
                value={agent.status === "SUSPENDED" ? "reactivate" : "suspend"}
                className={`btn h-11 rounded-xl ${
                  agent.status === "SUSPENDED" ? "btn-success" : "btn-error"
                }`}
                type="submit"
              >
                {agent.status === "SUSPENDED"
                  ? "Réactiver l’agent"
                  : "Suspendre l’agent"}
              </button>
            </Form>
          ) : null}
        </AppCard>

        <AppCard padding="lg">
          <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
            Activité récente
          </h2>
          <AuditTimeline items={activity} />
        </AppCard>
      </div>
    </>
  );
}

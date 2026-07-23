import { Form, Link, useNavigation } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AuditTimeline } from "~/components/ui/AuditTimeline";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { DetailPageLayout } from "~/components/ui/DetailPageLayout";
import { DetailSectionCard } from "~/components/ui/DetailSectionCard";
import { FormField } from "~/components/ui/FormField";
import { AgentStatusBadge } from "~/components/ui/StatusBadge";
import type { Agent } from "~/types/admin";
import { ADMIN_ROLE_LABELS } from "~/types/admin";
import { CsrfField } from "~/components/security/CsrfProvider";
import {
  labelAgentActivity,
  type AgentActivityItem,
} from "~/services/agents/agent-activity";

export function AgentDetailPage({
  agent,
  activity,
}: {
  agent: Agent;
  activity: AgentActivityItem[];
}) {
  const navigation = useNavigation();
  const busy = navigation.state !== "idle";
  const timeline = activity.map((item) => ({
    id: item.id,
    label: item.reason
      ? `${labelAgentActivity(item.action)} — ${item.reason}`
      : labelAgentActivity(item.action),
    actor: item.actorRole,
    createdAt: item.createdAt,
  }));

  return (
    <>
      <PageHeader
        title={agent.displayName}
        description={`${ADMIN_ROLE_LABELS[agent.role] ?? agent.role} · ${agent.email} · ${agent.establishmentName}`}
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

      <DetailPageLayout
        aside={
          <DetailSectionCard title="Activité récente">
            <AuditTimeline items={timeline} />
          </DetailSectionCard>
        }
      >
        <DetailSectionCard title="Identité et rattachement">
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
        </DetailSectionCard>
      </DetailPageLayout>
    </>
  );
}

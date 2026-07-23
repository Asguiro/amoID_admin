import { Form, useNavigation } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { DetailSectionCard } from "~/components/ui/DetailSectionCard";
import { FormField } from "~/components/ui/FormField";
import { DeviceStatusBadge } from "~/components/ui/StatusBadge";
import type { Device } from "~/types/admin";
import { CsrfField } from "~/components/security/CsrfProvider";

export function DeviceDetailPage({
  device,
  canTrust = false,
  canRevoke = true,
  actionData,
}: {
  device: Device;
  canTrust?: boolean;
  canRevoke?: boolean;
  actionData?: { error?: string };
}) {
  const navigation = useNavigation();
  const busy = navigation.state !== "idle";
  const date = (value: string) =>
    new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(value));

  return (
    <>
      <PageHeader
        title={device.label}
        description={`${device.platform} · ${device.agentName} · ${device.establishmentName}`}
        backTo="/devices"
        backLabel="Retour aux appareils"
        badge={<DeviceStatusBadge status={device.status} />}
      />

      {actionData?.error ? (
        <div role="alert" className="alert alert-error mb-4 max-w-3xl">
          {actionData.error}
        </div>
      ) : null}

      <DetailSectionCard className="max-w-4xl" title="Terminal et synchronisation">
        <DetailGrid>
          <DetailField label="Agent">{device.agentName}</DetailField>
          <DetailField label="Établissement">
            {device.establishmentName}
          </DetailField>
          <DetailField label="Dernière activité">
            {device.lastSeenAt ? date(device.lastSeenAt) : "—"}
          </DetailField>
          <DetailField label="Enrôlé le">{date(device.enrolledAt)}</DetailField>
          <DetailField label="Sync en attente">
            {String(device.pendingSyncCount ?? 0)}
          </DetailField>
          <DetailField label="Dernière sync">
            {device.lastSyncAt ? date(device.lastSyncAt) : "—"}
          </DetailField>
          <DetailField label="Identifiant" mono className="sm:col-span-2">
            {device.id}
          </DetailField>
        </DetailGrid>

        {canTrust && device.status === "PENDING" ? (
          <Form
            method="post"
            className="mt-8 space-y-4 border-t border-base-200 pt-6"
          >
            <CsrfField />
            <FormField label="Motif d’approbation">
              <textarea
                required
                name="reason"
                className="amo-textarea"
                placeholder="Indiquez la raison de l’approbation…"
              />
            </FormField>
            <button
              disabled={busy}
              name="intent"
              value="trust"
              className="btn btn-success h-11 rounded-xl"
              type="submit"
            >
              Approuver l’appareil
            </button>
          </Form>
        ) : null}

        {canRevoke && device.status !== "REVOKED" ? (
          <Form
            method="post"
            className="mt-8 space-y-4 border-t border-base-200 pt-6"
          >
            <CsrfField />
            <FormField label="Motif de révocation">
              <textarea
                required
                name="reason"
                className="amo-textarea"
                placeholder="Indiquez la raison de la révocation…"
              />
            </FormField>
            <button
              disabled={busy}
              name="intent"
              value="revoke"
              className="btn btn-error h-11 rounded-xl"
              type="submit"
            >
              Révoquer l’appareil
            </button>
          </Form>
        ) : null}
      </DetailSectionCard>
    </>
  );
}

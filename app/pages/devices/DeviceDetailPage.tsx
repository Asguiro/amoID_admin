import { Form, useNavigation } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { FormField } from "~/components/ui/FormField";
import { DeviceStatusBadge } from "~/components/ui/StatusBadge";
import type { Device } from "~/types/admin";
import { CsrfField } from "~/components/security/CsrfProvider";

export function DeviceDetailPage({ device }: { device: Device }) {
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
        description={device.platform}
        backTo="/devices"
        backLabel="Retour aux appareils"
        badge={<DeviceStatusBadge status={device.status} />}
      />

      <AppCard className="max-w-3xl" padding="lg">
        <h2 className="amo-display mb-5 text-lg font-semibold text-secondary">
          Terminal
        </h2>
        <DetailGrid>
          <DetailField label="Agent">{device.agentName}</DetailField>
          <DetailField label="Établissement">
            {device.establishmentName}
          </DetailField>
          <DetailField label="Dernière activité">
            {date(device.lastSeenAt)}
          </DetailField>
          <DetailField label="Enrôlé le">{date(device.enrolledAt)}</DetailField>
          <DetailField label="Identifiant" mono className="sm:col-span-2">
            {device.id}
          </DetailField>
        </DetailGrid>

        {device.status !== "REVOKED" ? (
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
      </AppCard>
    </>
  );
}

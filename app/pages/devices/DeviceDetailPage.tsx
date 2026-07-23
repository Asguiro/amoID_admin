import { Form, useNavigation } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { DetailSectionCard } from "~/components/ui/DetailSectionCard";
import { ReasonComposer } from "~/components/ui/ReasonComposer";
import { DeviceStatusBadge } from "~/components/ui/StatusBadge";
import {
  DEVICE_APPROVE_REASONS,
  DEVICE_REVOKE_REASONS,
} from "~/config/reason-options";
import type { Device } from "~/types/admin";
import { CsrfField } from "~/components/security/CsrfProvider";

const HISTORY_LABELS: Record<string, string> = {
  DEVICE_TRUST: "Approbation / enrôlement",
  DEVICE_REVOKE: "Révocation",
  DEVICE_RESTORE: "Restauration",
  DEVICE_REGISTRATION_REQUESTED: "Demande d’enregistrement",
};

export function DeviceDetailPage({
  device,
  canTrust = false,
  canRevoke = true,
  canRestore = false,
  actionData,
}: {
  device: Device;
  canTrust?: boolean;
  canRevoke?: boolean;
  canRestore?: boolean;
  actionData?: { error?: string; success?: string };
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
      {actionData?.success ? (
        <div role="status" className="alert alert-success mb-4 max-w-3xl">
          {actionData.success}
        </div>
      ) : null}

      {device.status === "PENDING" ? (
        <div role="status" className="alert alert-warning mb-4 max-w-3xl">
          <div>
            <p className="font-medium">En attente d’approbation</p>
            <p className="text-sm">
              L’agent ne peut pas se connecter tant que cet appareil n’est pas
              approuvé.
            </p>
          </div>
        </div>
      ) : null}

      {device.status === "REVOKED" ? (
        <div role="status" className="alert alert-warning mb-4 max-w-3xl">
          <div>
            <p className="font-medium">Appareil révoqué</p>
            <p className="text-sm">
              Les sessions mobiles liées sont invalidées. L’agent ne pourra plus
              se connecter ni synchroniser tant que l’appareil n’aura pas été
              restauré (admin central).
              {device.revokedAt
                ? ` Révoqué le ${date(device.revokedAt)}.`
                : null}
            </p>
          </div>
        </div>
      ) : null}

      <DetailSectionCard className="max-w-4xl" title="Terminal et synchronisation">
        <DetailGrid>
          <DetailField label="Identifiant métier" mono className="sm:col-span-2">
            {device.deviceId}
          </DetailField>
          <DetailField label="Agent">{device.agentName}</DetailField>
          <DetailField label="Établissement">
            {device.establishmentName}
          </DetailField>
          <DetailField label="Dernière activité">
            {device.lastSeenAt ? date(device.lastSeenAt) : "—"}
          </DetailField>
          <DetailField label="Enrôlé le">{date(device.enrolledAt)}</DetailField>
          <DetailField label="Sync conflits">
            {String(device.pendingSyncCount ?? 0)}
          </DetailField>
          <DetailField label="Dernière sync">
            {device.lastSyncAt ? date(device.lastSyncAt) : "—"}
          </DetailField>
          {device.revokedAt ? (
            <DetailField label="Révoqué le">{date(device.revokedAt)}</DetailField>
          ) : null}
          <DetailField label="ID technique" mono className="sm:col-span-2">
            {device.id}
          </DetailField>
        </DetailGrid>

        {canTrust && device.status === "PENDING" ? (
          <Form
            method="post"
            className="mt-8 space-y-4 border-t border-base-200 pt-6"
          >
            <CsrfField />
            <ReasonComposer
              options={DEVICE_APPROVE_REASONS}
              label="Motif d’approbation"
              disabled={busy}
            />
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

        {canRestore && device.status === "REVOKED" ? (
          <Form
            method="post"
            className="mt-8 space-y-4 border-t border-base-200 pt-6"
          >
            <CsrfField />
            <ReasonComposer
              options={DEVICE_APPROVE_REASONS}
              label="Motif de restauration"
              disabled={busy}
            />
            <button
              disabled={busy}
              name="intent"
              value="restore"
              className="btn btn-success h-11 rounded-xl"
              type="submit"
            >
              Restaurer l’appareil
            </button>
            <p className="text-xs text-base-content/55">
              Après restauration, l’agent devra se reconnecter sur ce terminal.
            </p>
          </Form>
        ) : null}

        {canRevoke && device.status !== "REVOKED" ? (
          <Form
            method="post"
            className="mt-8 space-y-4 border-t border-base-200 pt-6"
          >
            <CsrfField />
            <ReasonComposer
              options={DEVICE_REVOKE_REASONS}
              label="Motif de révocation"
              disabled={busy}
            />
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

        {device.status === "REVOKED" && !canRestore ? (
          <p className="mt-8 border-t border-base-200 pt-6 text-sm text-base-content/60">
            Seul un administrateur central peut restaurer cet appareil.
          </p>
        ) : null}
      </DetailSectionCard>

      {device.history && device.history.length > 0 ? (
        <DetailSectionCard className="mt-5 max-w-4xl" title="Historique">
          <ul className="space-y-3 text-sm">
            {device.history.map((entry) => (
              <li
                key={entry.id}
                className="rounded-xl border border-base-200 px-4 py-3"
              >
                <p className="font-medium">
                  {HISTORY_LABELS[entry.action] ?? entry.action}
                </p>
                <p className="text-base-content/60">
                  {date(entry.createdAt)}
                  {entry.reason ? ` · ${entry.reason}` : null}
                </p>
              </li>
            ))}
          </ul>
        </DetailSectionCard>
      ) : null}
    </>
  );
}

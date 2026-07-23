import { Form, Link, useNavigation } from "react-router";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
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

const PLATFORM_LABELS: Record<string, string> = {
  android: "Android",
  ios: "iOS",
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
  const platformLabel =
    PLATFORM_LABELS[device.platform] ?? device.platform;
  const hardwareLabel = [device.brand, device.model].filter(Boolean).join(" ");

  return (
    <>
      <PageHeader
        title={device.label}
        description={
          hardwareLabel
            ? `${hardwareLabel} · ${device.agentName} · ${device.establishmentName}`
            : `${platformLabel} · ${device.agentName} · ${device.establishmentName}`
        }
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
              approuvé. L’alerte liée sera clôturée automatiquement après
              approbation.
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

      <div className="grid max-w-4xl gap-5 lg:grid-cols-[1.4fr_1fr]">
        <DetailSectionCard title="Identité du terminal">
          <DetailGrid>
            <DetailField label="Libellé" className="sm:col-span-2">
              {device.label}
            </DetailField>
            <DetailField label="Identifiant métier" mono className="sm:col-span-2">
              {device.deviceId}
            </DetailField>
            <DetailField label="Marque">
              {device.brand || "—"}
            </DetailField>
            <DetailField label="Modèle">
              {device.model || "—"}
            </DetailField>
            <DetailField label="Fabricant">
              {device.manufacturer || "—"}
            </DetailField>
            <DetailField label="Système">
              {platformLabel}
              {device.osVersion ? ` ${device.osVersion}` : ""}
            </DetailField>
            <DetailField label="Statut de confiance">
              <DeviceStatusBadge status={device.status} />
            </DetailField>
            <DetailField label="Agent">
              {device.agentId ? (
                <Link
                  className="link link-primary"
                  to={`/agents/${device.agentId}`}
                >
                  {device.agentName}
                </Link>
              ) : (
                device.agentName
              )}
            </DetailField>
            <DetailField label="Établissement">
              {device.establishmentName}
            </DetailField>
            <DetailField label="Enrôlé le">{date(device.enrolledAt)}</DetailField>
            <DetailField label="Dernière activité">
              {device.lastSeenAt ? date(device.lastSeenAt) : "Jamais"}
            </DetailField>
            {device.revokedAt ? (
              <DetailField label="Révoqué le">{date(device.revokedAt)}</DetailField>
            ) : null}
          </DetailGrid>
        </DetailSectionCard>

        <div className="space-y-5">
          <AppCard padding="lg">
            <h2 className="amo-display mb-3 text-base font-semibold text-secondary">
              Synchronisation
            </h2>
            <DetailGrid>
              <DetailField label="Conflits sync">
                {String(device.pendingSyncCount ?? 0)}
              </DetailField>
              <DetailField label="Dernière sync">
                {device.lastSyncAt ? date(device.lastSyncAt) : "—"}
              </DetailField>
            </DetailGrid>
          </AppCard>

          <AppCard padding="lg">
            <h2 className="amo-display mb-2 text-base font-semibold text-secondary">
              Actions de gestion
            </h2>
            <p className="mb-4 text-sm text-base-content/65">
              Ces actions contrôlent l’accès de ce terminal à l’application
              mobile.
            </p>

            {canTrust && device.status === "PENDING" ? (
              <Form method="post" className="space-y-4">
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
                  className="btn btn-success h-11 w-full rounded-xl"
                  type="submit"
                >
                  Approuver l’appareil
                </button>
              </Form>
            ) : null}

            {canRestore && device.status === "REVOKED" ? (
              <Form method="post" className="space-y-4">
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
                  className="btn btn-success h-11 w-full rounded-xl"
                  type="submit"
                >
                  Restaurer l’appareil
                </button>
                <p className="text-xs text-base-content/55">
                  Après restauration, l’agent devra se reconnecter sur ce
                  terminal.
                </p>
              </Form>
            ) : null}

            {canRevoke && device.status !== "REVOKED" ? (
              <Form
                method="post"
                className={
                  canTrust && device.status === "PENDING"
                    ? "mt-6 space-y-4 border-t border-base-200 pt-6"
                    : "space-y-4"
                }
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
                  className="btn btn-error h-11 w-full rounded-xl"
                  type="submit"
                >
                  Révoquer l’appareil
                </button>
              </Form>
            ) : null}

            {device.status === "REVOKED" && !canRestore ? (
              <p className="text-sm text-base-content/60">
                Seul un administrateur central peut restaurer cet appareil.
              </p>
            ) : null}

            {device.status === "TRUSTED" && !canRevoke ? (
              <p className="text-sm text-base-content/60">
                Aucune action disponible pour votre rôle sur cet appareil.
              </p>
            ) : null}
          </AppCard>
        </div>
      </div>

      {device.history && device.history.length > 0 ? (
        <DetailSectionCard className="mt-5 max-w-4xl" title="Historique de gestion">
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

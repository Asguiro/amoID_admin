import { Form, Link, useNavigation } from "react-router";
import { ShieldCheck, SlidersHorizontal } from "lucide-react";

import { PageHeader } from "~/components/layouts/PageHeader";
import { AppCard } from "~/components/ui/AppCard";
import { DetailField, DetailGrid } from "~/components/ui/DetailField";
import { FormField } from "~/components/ui/FormField";
import { CsrfField } from "~/components/security/CsrfProvider";
import { adminRoles } from "~/config/permissions";
import { ADMIN_ROLE_LABELS, type AppSettings, type FraudRule } from "~/types/admin";

export function FraudRulesPage({
  rules,
  canUpdate,
  actionData,
}: {
  rules: FraudRule[];
  canUpdate: boolean;
  actionData?: { error?: string; success?: string };
}) {
  const busy = useNavigation().state === "submitting";

  return (
    <>
      <PageHeader
        title="Règles de fraude"
        description="Seuils des signaux utilisés pour orienter les investigations."
      />
      {actionData?.error ? (
        <div role="alert" className="alert alert-error mb-4">
          {actionData.error}
        </div>
      ) : null}
      {actionData?.success ? (
        <div role="status" className="alert alert-success mb-4">
          {actionData.success}
        </div>
      ) : null}
      <div className="grid gap-4">
        {rules.map((rule) => (
          <AppCard key={rule.id} padding="lg">
            <div className="flex gap-4">
              <SlidersHorizontal
                className="size-8 shrink-0 text-primary"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <h2 className="amo-display text-lg font-semibold text-secondary">
                  {rule.name}
                </h2>
                <p className="mt-1 text-sm text-base-content/60">
                  {rule.description}
                </p>
                {canUpdate ? (
                  <Form method="post" className="mt-4 flex flex-wrap items-end gap-3">
                    <CsrfField />
                    <input type="hidden" name="ruleId" value={rule.id} />
                    <FormField label="Seuil">
                      <input
                        type="number"
                        name="threshold"
                        min={1}
                        defaultValue={rule.threshold}
                        className="amo-input w-28"
                      />
                    </FormField>
                    <label className="flex h-11 items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="enabled"
                        value="1"
                        defaultChecked={rule.enabled}
                        className="checkbox checkbox-sm"
                      />
                      Active
                    </label>
                    <button
                      disabled={busy}
                      name="intent"
                      value="update-rule"
                      className="btn btn-primary h-11 rounded-xl"
                    >
                      Enregistrer
                    </button>
                    <span className="text-xs text-base-content/50">
                      Unité : {rule.unit}
                    </span>
                  </Form>
                ) : (
                  <p className="mt-3 text-sm">
                    Seuil : <strong>{rule.threshold}</strong> {rule.unit} ·{" "}
                    {rule.enabled ? "Active" : "Inactive"}
                  </p>
                )}
              </div>
            </div>
          </AppCard>
        ))}
      </div>
    </>
  );
}

export function AccessSettingsPage() {
  return (
    <>
      <PageHeader
        title="Paramètres d’accès"
        description="Référentiel des rôles administratifs (alignés sur le mobile agent)."
        actions={
          <Link className="btn btn-outline h-10 rounded-xl" to="/settings/operations">
            Paramètres opérationnels
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Object.values(adminRoles).map((role) => (
          <AppCard key={role}>
            <ShieldCheck className="mb-4 size-7 text-primary" aria-hidden />
            <h2 className="font-semibold text-secondary">
              {ADMIN_ROLE_LABELS[role] ?? role}
            </h2>
            <p className="mt-1 font-mono text-xs text-base-content/50">{role}</p>
          </AppCard>
        ))}
      </div>
    </>
  );
}

export function OperationsSettingsPage({
  settings,
  canUpdate,
  actionData,
}: {
  settings: AppSettings;
  canUpdate: boolean;
  actionData?: { error?: string; success?: string };
}) {
  const busy = useNavigation().state === "submitting";

  return (
    <>
      <PageHeader
        title="Paramètres opérationnels"
        description="Seuils QR, tentatives faciales et rétention d’audit."
        backTo="/settings/access"
        backLabel="Retour aux accès"
      />
      {actionData?.error ? (
        <div role="alert" className="alert alert-error mb-4">
          {actionData.error}
        </div>
      ) : null}
      {actionData?.success ? (
        <div role="status" className="alert alert-success mb-4">
          {actionData.success}
        </div>
      ) : null}

      {canUpdate ? (
        <AppCard className="max-w-2xl" padding="lg">
          <Form method="post" className="grid gap-5 sm:grid-cols-2">
            <CsrfField />
            <FormField label="Durée QR max">
              <select
                name="maxQrDuration"
                defaultValue={settings.maxQrDuration}
                className="amo-select"
              >
                <option value="24H">24 h</option>
                <option value="72H">72 h</option>
                <option value="7D">7 jours</option>
              </select>
            </FormField>
            <FormField label="Tentatives face max">
              <input
                type="number"
                name="maxFaceAttempts"
                min={1}
                max={10}
                defaultValue={settings.maxFaceAttempts}
                className="amo-input"
              />
            </FormField>
            <FormField label="Rétention audit (jours)" className="sm:col-span-2">
              <input
                type="number"
                name="auditRetentionDays"
                min={30}
                max={3650}
                defaultValue={settings.auditRetentionDays}
                className="amo-input"
              />
            </FormField>
            <button
              disabled={busy}
              name="intent"
              value="update-settings"
              className="btn btn-primary h-11 rounded-xl sm:col-span-2"
            >
              Enregistrer
            </button>
          </Form>
        </AppCard>
      ) : (
        <AppCard className="max-w-2xl" padding="lg">
          <DetailGrid>
            <DetailField label="Durée QR max">
              {settings.maxQrDuration}
            </DetailField>
            <DetailField label="Tentatives face">
              {String(settings.maxFaceAttempts)}
            </DetailField>
            <DetailField label="Rétention audit">
              {settings.auditRetentionDays} jours
            </DetailField>
          </DetailGrid>
        </AppCard>
      )}
    </>
  );
}

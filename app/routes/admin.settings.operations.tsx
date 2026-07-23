import { OperationsSettingsPage } from "~/pages/settings/SettingsPages";
import { permissions } from "~/config/permissions";
import { requirePermission } from "~/server/auth/require-permission.server";
import { requireCsrfToken } from "~/server/security/csrf.server";
import { requireAccessToken } from "~/server/session.server";
import {
  getAppSettings,
  updateAppSettings,
} from "~/services/settings/settings.service";
import type { TemporaryQrDuration } from "~/types/admin";
import type { Route } from "./+types/admin.settings.operations";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requirePermission(request, permissions.settingsRead);
  const accessToken = await requireAccessToken(request);
  return {
    settings: await getAppSettings(accessToken),
    canUpdate: user.permissions.includes(permissions.settingsUpdate),
  };
}

export async function action({ request }: Route.ActionArgs) {
  await requireCsrfToken(request);
  await requirePermission(request, permissions.settingsUpdate);
  const accessToken = await requireAccessToken(request);
  const formData = await request.formData();
  if (formData.get("intent") !== "update-settings") {
    return { error: "Action invalide." };
  }
  const maxQrDuration = String(
    formData.get("maxQrDuration") ?? "7D",
  ) as TemporaryQrDuration;
  const maxFaceAttempts = Number(formData.get("maxFaceAttempts") ?? 3);
  const auditRetentionDays = Number(formData.get("auditRetentionDays") ?? 365);
  if (!Number.isFinite(maxFaceAttempts) || maxFaceAttempts < 1) {
    return { error: "Nombre de tentatives invalide." };
  }
  await updateAppSettings(
    {
      maxQrDuration,
      maxFaceAttempts,
      auditRetentionDays,
    },
    accessToken,
  );
  return { success: "Paramètres enregistrés." };
}

export default function OperationsSettingsRoute({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  return (
    <OperationsSettingsPage
      settings={loaderData.settings}
      canUpdate={loaderData.canUpdate}
      actionData={actionData}
    />
  );
}

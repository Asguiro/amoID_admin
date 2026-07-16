import { FraudRulesPage } from "~/pages/settings/SettingsPages";
import { permissions } from "~/config/permissions";
import {
  requireAnyPermission,
  requirePermission,
} from "~/server/auth/require-permission.server";
import { requireCsrfToken } from "~/server/security/csrf.server";
import {
  listFraudRules,
  updateFraudRule,
} from "~/services/settings/settings.service";
import type { Route } from "./+types/admin.fraud.rules";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAnyPermission(request, [
    permissions.settingsRead,
    permissions.alertDecide,
  ]);
  return {
    rules: await listFraudRules(),
    canUpdate: user.permissions.includes(permissions.settingsUpdate),
  };
}

export async function action({ request }: Route.ActionArgs) {
  await requireCsrfToken(request);
  await requirePermission(request, permissions.settingsUpdate);
  const formData = await request.formData();
  if (formData.get("intent") !== "update-rule") {
    return { error: "Action invalide." };
  }
  const ruleId = String(formData.get("ruleId") ?? "");
  const threshold = Number(formData.get("threshold") ?? 0);
  const enabled = formData.get("enabled") === "1";
  if (!ruleId || !Number.isFinite(threshold) || threshold < 1) {
    return { error: "Seuil invalide." };
  }
  await updateFraudRule(ruleId, { threshold, enabled });
  return { success: "Règle mise à jour." };
}

export default function FraudRulesRoute({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  return (
    <FraudRulesPage
      rules={loaderData.rules}
      canUpdate={loaderData.canUpdate}
      actionData={actionData}
    />
  );
}

import { permissions } from "~/config/permissions";
import {
  getEnrollment,
  listEnrollments,
  requestManualReview,
  returnEnrollmentForCorrection,
  validateEnrollment,
} from "~/services/enrollments/enrollment.service";
import { parseListSearchParams } from "~/utils/search-params";

import { requirePermission } from "../auth/require-permission.server";
import { requireCsrfToken } from "../security/csrf.server";

export async function loadEnrollments(request: Request, pendingOnly = false) {
  await requirePermission(request, permissions.enrollmentRead);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  if (pendingOnly) query.status = "PENDING_VALIDATION";
  return { result: await listEnrollments(query), query, pendingOnly };
}

export async function loadEnrollment(request: Request, id: string) {
  const user = await requirePermission(request, permissions.enrollmentRead);
  const enrollment = await getEnrollment(id);
  if (!enrollment) throw new Response("Enrôlement introuvable", { status: 404 });
  return {
    enrollment,
    canValidate: user.permissions.includes(permissions.enrollmentValidate),
    canReturn: user.permissions.includes(permissions.enrollmentReturnForCorrection),
  };
}

export async function mutateEnrollment(request: Request, id: string) {
  await requireCsrfToken(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const comment = String(formData.get("comment") ?? "").trim();

  if (intent === "validate") {
    await requirePermission(request, permissions.enrollmentValidate);
    return { enrollment: await validateEnrollment(id), success: "Enrôlement validé." };
  }

  await requirePermission(request, permissions.enrollmentReturnForCorrection);
  if (!comment) return { error: "Le commentaire est obligatoire." };
  const enrollment = intent === "manual-review"
    ? await requestManualReview(id, comment)
    : await returnEnrollmentForCorrection(id, comment);
  return { enrollment, success: intent === "manual-review" ? "Analyse manuelle demandée." : "Dossier retourné pour correction." };
}

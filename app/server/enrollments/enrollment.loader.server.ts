import { permissions } from "~/config/permissions";
import {
  ENROLLMENT_MANUAL_REVIEW_REASONS,
  ENROLLMENT_REJECT_REASONS,
  ENROLLMENT_RETURN_REASONS,
} from "~/config/reason-options";
import {
  getEnrollment,
  listEnrollments,
  rejectEnrollment,
  requestManualReview,
  returnEnrollmentForCorrection,
  validateEnrollment,
} from "~/services/enrollments/enrollment.service";
import type { EnrollmentStatus } from "~/types/admin";
import { composeReasonFromForm } from "~/utils/compose-reason";
import { enrollmentActionFlags } from "~/utils/enrollment-actions";
import { parseListSearchParams } from "~/utils/search-params";

import { requirePermission } from "../auth/require-permission.server";
import { ApiClientError } from "../api/errors.server";
import { requireCsrfToken } from "../security/csrf.server";
import { requireAccessToken } from "../session.server";

function actionError(error: unknown, fallback: string) {
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export { enrollmentActionFlags };

export async function loadEnrollments(request: Request, pendingOnly = false) {
  await requirePermission(request, permissions.enrollmentRead);
  const accessToken = await requireAccessToken(request);
  const query = parseListSearchParams(new URL(request.url).searchParams);
  if (pendingOnly) query.status = "PENDING_VALIDATION";
  return { result: await listEnrollments(query, accessToken), query, pendingOnly };
}

export async function loadEnrollment(request: Request, id: string) {
  const user = await requirePermission(request, permissions.enrollmentRead);
  const accessToken = await requireAccessToken(request);
  const enrollment = await getEnrollment(id, accessToken);
  if (!enrollment) throw new Response("Enrôlement introuvable", { status: 404 });
  return {
    enrollment,
    permissions: user.permissions,
    ...enrollmentActionFlags(enrollment, user.permissions),
  };
}

function assertEnrollmentStatus(
  status: EnrollmentStatus,
  allowed: EnrollmentStatus[],
  message: string,
) {
  if (!allowed.includes(status)) {
    throw new Error(message);
  }
}

export async function mutateEnrollment(request: Request, id: string) {
  await requireCsrfToken(request);
  const accessToken = await requireAccessToken(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  try {
    const current = await getEnrollment(id, accessToken);
    if (!current) throw new Response("Enrôlement introuvable", { status: 404 });

    if (intent === "validate") {
      await requirePermission(request, permissions.enrollmentValidate);
      assertEnrollmentStatus(
        current.status,
        ["PENDING_VALIDATION"],
        "Seuls les dossiers en attente peuvent être validés.",
      );
      return {
        enrollment: await validateEnrollment(id, accessToken),
        success: "Enrôlement validé.",
      };
    }

    if (intent === "reject") {
      await requirePermission(request, permissions.enrollmentReject);
      assertEnrollmentStatus(
        current.status,
        ["PENDING_VALIDATION", "RETURNED"],
        "Ce dossier ne peut pas être rejeté dans cet état.",
      );
      const composed = composeReasonFromForm(
        formData,
        ENROLLMENT_REJECT_REASONS,
      );
      if (!composed.ok) return { error: composed.error };
      return {
        enrollment: await rejectEnrollment(id, composed.reason, accessToken),
        success: "Enrôlement rejeté.",
      };
    }

    if (intent === "manual-review") {
      await requirePermission(
        request,
        permissions.enrollmentReturnForCorrection,
      );
      assertEnrollmentStatus(
        current.status,
        ["PENDING_VALIDATION"],
        "L’analyse manuelle n’est disponible que pour les dossiers en attente.",
      );
      const composed = composeReasonFromForm(
        formData,
        ENROLLMENT_MANUAL_REVIEW_REASONS,
      );
      if (!composed.ok) return { error: composed.error };
      return {
        enrollment: await requestManualReview(
          id,
          composed.reason,
          accessToken,
        ),
        success: "Analyse manuelle demandée.",
      };
    }

    if (intent === "return") {
      await requirePermission(
        request,
        permissions.enrollmentReturnForCorrection,
      );
      assertEnrollmentStatus(
        current.status,
        ["PENDING_VALIDATION"],
        "Seuls les dossiers en attente peuvent être renvoyés.",
      );
      const composed = composeReasonFromForm(
        formData,
        ENROLLMENT_RETURN_REASONS,
      );
      if (!composed.ok) return { error: composed.error };
      return {
        enrollment: await returnEnrollmentForCorrection(
          id,
          composed.reason,
          accessToken,
        ),
        success: "Dossier retourné pour correction.",
      };
    }

    return { error: "Action d’enrôlement inconnue." };
  } catch (error) {
    if (error instanceof Response) throw error;
    return {
      error: actionError(error, "Impossible de traiter l’enrôlement."),
    };
  }
}

import { permissions } from "~/config/permissions";
import type { Enrollment } from "~/types/admin";

export function enrollmentActionFlags(
  enrollment: Enrollment,
  userPermissions: readonly string[],
) {
  const pending = enrollment.status === "PENDING_VALIDATION";
  const rejectable =
    enrollment.status === "PENDING_VALIDATION" ||
    enrollment.status === "RETURNED";

  return {
    canValidate:
      pending && userPermissions.includes(permissions.enrollmentValidate),
    canReturn:
      pending &&
      userPermissions.includes(permissions.enrollmentReturnForCorrection),
    canManualReview:
      pending && userPermissions.includes(permissions.enrollmentValidate),
    canReject:
      rejectable && userPermissions.includes(permissions.enrollmentReject),
  };
}

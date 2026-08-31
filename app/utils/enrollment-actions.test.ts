import { describe, expect, it } from "vitest";

import { permissions } from "~/config/permissions";
import type { Enrollment } from "~/types/admin";

import { enrollmentActionFlags } from "./enrollment-actions";

const baseEnrollment: Enrollment = {
  id: "enr_001",
  beneficiaryName: "Aminata Traoré",
  status: "PENDING_VALIDATION",
  establishmentName: "CSRéf Commune III",
  submittedBy: "Mamadou Diallo",
  submittedAt: "2026-07-01T00:00:00.000Z",
  duplicateHints: [],
  isProvisional: false,
  syncStatus: "SYNCED",
  healthConsentAccepted: true,
};

describe("enrollmentActionFlags", () => {
  it("autorise manual-review avec enrollment.validate uniquement", () => {
    const flags = enrollmentActionFlags(baseEnrollment, [
      permissions.enrollmentValidate,
    ]);
    expect(flags.canManualReview).toBe(true);
    expect(flags.canReturn).toBe(false);
  });

  it("refuse manual-review avec return_for_correction seul", () => {
    const flags = enrollmentActionFlags(baseEnrollment, [
      permissions.enrollmentReturnForCorrection,
    ]);
    expect(flags.canManualReview).toBe(false);
    expect(flags.canReturn).toBe(true);
  });

  it("désactive toutes les actions sur dossier validé", () => {
    const flags = enrollmentActionFlags(
      { ...baseEnrollment, status: "VALIDATED" },
      [
        permissions.enrollmentValidate,
        permissions.enrollmentReturnForCorrection,
        permissions.enrollmentReject,
      ],
    );
    expect(flags.canValidate).toBe(false);
    expect(flags.canManualReview).toBe(false);
    expect(flags.canReturn).toBe(false);
    expect(flags.canReject).toBe(false);
  });
});

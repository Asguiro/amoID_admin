import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getEnrollment,
  rejectEnrollment,
  requestManualReview,
  returnEnrollmentForCorrection,
  validateEnrollment,
} from "./enrollment.service";

vi.mock("~/server/api/client.server", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "~/server/api/client.server";

const apiRequestMock = vi.mocked(apiRequest);

const sampleEnrollment = {
  id: "enr_001",
  beneficiaryName: "Aminata Traoré",
  status: "PENDING_VALIDATION" as const,
  establishmentName: "CSRéf Commune III",
  submittedBy: "Mamadou Diallo",
  submittedAt: "2026-07-01T00:00:00.000Z",
  duplicateHints: [],
  isProvisional: false,
  syncStatus: "SYNCED" as const,
  healthConsentAccepted: true,
  media: [],
};

describe("enrollment.service", () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
  });

  it("valide un enrôlement via l’API", async () => {
    apiRequestMock.mockResolvedValueOnce({
      ...sampleEnrollment,
      status: "VALIDATED",
    });

    const result = await validateEnrollment("enr_001", "token");

    expect(apiRequestMock).toHaveBeenCalledWith(
      "/admin/enrollments/enr_001/validate",
      expect.objectContaining({ method: "POST", accessToken: "token" }),
    );
    expect(result.status).toBe("VALIDATED");
  });

  it("retourne un enrôlement pour correction avec motif", async () => {
    apiRequestMock.mockResolvedValueOnce({
      ...sampleEnrollment,
      status: "RETURNED",
    });

    const result = await returnEnrollmentForCorrection(
      "enr_001",
      "La pièce d’identité doit être remplacée.",
      "token",
    );

    expect(apiRequestMock).toHaveBeenCalledWith(
      "/admin/enrollments/enr_001/return-for-correction",
      expect.objectContaining({
        method: "POST",
        accessToken: "token",
        body: { reason: "La pièce d’identité doit être remplacée." },
      }),
    );
    expect(result.status).toBe("RETURNED");
  });

  it("refuse un retour sans commentaire", async () => {
    await expect(
      returnEnrollmentForCorrection("enr_001", "  ", "token"),
    ).rejects.toThrow("Le commentaire est obligatoire.");
    expect(apiRequestMock).not.toHaveBeenCalled();
  });

  it("demande une analyse manuelle via l’API", async () => {
    apiRequestMock.mockResolvedValueOnce({
      ...sampleEnrollment,
      status: "PENDING_VALIDATION",
    });

    await requestManualReview("enr_001", "Contrôle doublon", "token");

    expect(apiRequestMock).toHaveBeenCalledWith(
      "/admin/enrollments/enr_001/request-manual-review",
      expect.objectContaining({
        body: { reason: "Contrôle doublon" },
      }),
    );
  });

  it("rejette un enrôlement avec motif", async () => {
    apiRequestMock.mockResolvedValueOnce({
      ...sampleEnrollment,
      status: "REJECTED",
    });

    const result = await rejectEnrollment("enr_001", "Doublon confirmé", "token");
    expect(apiRequestMock).toHaveBeenCalledWith(
      "/admin/enrollments/enr_001/reject",
      expect.objectContaining({
        body: { reason: "Doublon confirmé" },
      }),
    );
    expect(result.status).toBe("REJECTED");
  });

  it("refuse un rejet sans motif", async () => {
    await expect(rejectEnrollment("enr_001", " ", "token")).rejects.toThrow(
      "Le motif de rejet est obligatoire.",
    );
    expect(apiRequestMock).not.toHaveBeenCalled();
  });

  it("retourne null pour un enrôlement introuvable", async () => {
    apiRequestMock.mockRejectedValueOnce({ status: 404 });
    await expect(getEnrollment("missing", "token")).resolves.toBeNull();
  });
});

import { describe, expect, it, vi, beforeEach } from "vitest";

import {
  getBeneficiaryDetail,
  listBeneficiaries,
  revealSensitive,
} from "./beneficiary.service";

vi.mock("~/server/api/client.server", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "~/server/api/client.server";

const apiRequestMock = vi.mocked(apiRequest);

describe("beneficiary.service", () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
  });

  it("appelle l’API avec les filtres de recherche", async () => {
    apiRequestMock.mockResolvedValueOnce({
      items: [
        {
          id: "ben-1",
          displayName: "Aminata Traoré",
          ninaMasked: "NINA-••••-2841",
          amoNumberMasked: "AMO-••••-4182",
          biometricCardNumberMasked: "CB-••••-9012",
          status: "ACTIVE",
          establishmentName: "CSRéf Commune III",
          region: "Bamako",
          coverageStatus: "ACTIVE",
          beneficiaryType: "PRIMARY",
          dossierStatus: "COMPLETE",
          hasBiometrics: true,
          hasHealthInfo: true,
          updatedAt: new Date().toISOString(),
        },
      ],
      pagination: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 },
      generatedAt: new Date().toISOString(),
    });

    const result = await listBeneficiaries(
      {
        q: "Aminata",
        page: 1,
        pageSize: 10,
        coverageStatus: "ACTIVE",
        dossierStatus: "COMPLETE",
      },
      "token",
    );

    expect(apiRequestMock).toHaveBeenCalledWith(
      expect.stringContaining("/admin/beneficiaries?"),
      expect.objectContaining({ accessToken: "token" }),
    );
    const url = String(apiRequestMock.mock.calls[0]?.[0]);
    expect(url).toContain("q=Aminata");
    expect(url).toContain("coverageStatus=ACTIVE");
    expect(url).toContain("dossierStatus=COMPLETE");
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.displayName).toBe("Aminata Traoré");
  });

  it("charge le détail avec activité et couverture", async () => {
    apiRequestMock
      .mockResolvedValueOnce({
        id: "ben-1",
        displayName: "Aminata Traoré",
        ninaMasked: "NINA-••••-2841",
        amoNumberMasked: "AMO-••••-4182",
        biometricCardNumberMasked: "CB-••••-9012",
        nina: "NINA-FULL",
        amoNumber: "AMO-FULL",
        biometricCardNumber: "CB-FULL",
        status: "ACTIVE",
        establishmentName: "CSRéf",
        region: "Bamako",
        coverageStatus: "ACTIVE",
        beneficiaryType: "PRIMARY",
        dossierStatus: "COMPLETE",
        hasBiometrics: true,
        hasHealthInfo: false,
        phoneMasked: "+223 •• •• 41 82",
        updatedAt: new Date().toISOString(),
        media: [],
      })
      .mockResolvedValueOnce({
        items: [{ id: "a1", label: "VIEW", createdAt: "2026-01-01T00:00:00.000Z" }],
        pagination: { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 },
        generatedAt: new Date().toISOString(),
      })
      .mockResolvedValueOnce({
        beneficiaryId: "ben-1",
        coverageStatus: "ACTIVE",
        history: [
          {
            id: "c1",
            label: "Couverture AMO",
            from: "2025-01-01",
            to: "2026-12-31",
            status: "ACTIVE",
          },
        ],
      });

    const detail = await getBeneficiaryDetail("ben-1", "token");

    expect(detail?.nina).toBeUndefined();
    expect(detail?.activity).toHaveLength(1);
    expect(detail?.coverageHistory).toHaveLength(1);
    expect(apiRequestMock).toHaveBeenCalledTimes(3);
  });

  it("révèle les identifiants sensibles via l’API", async () => {
    apiRequestMock.mockResolvedValueOnce({
      id: "ben-1",
      nina: "NINA-FULL",
      amoNumber: "AMO-FULL",
      biometricCardNumber: "CB-FULL",
    });

    const sensitive = await revealSensitive("ben-1", "token");
    expect(sensitive).toEqual({
      nina: "NINA-FULL",
      amoNumber: "AMO-FULL",
      biometricCardNumber: "CB-FULL",
    });
  });
});

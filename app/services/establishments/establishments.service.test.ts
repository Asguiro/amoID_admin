import { describe, expect, it, vi, beforeEach } from "vitest";

import { listEstablishments } from "./establishments.service";

vi.mock("~/server/api/client.server", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "~/server/api/client.server";

const apiRequestMock = vi.mocked(apiRequest);

describe("establishments.service", () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
  });

  it("appelle l’API avec les filtres de recherche", async () => {
    apiRequestMock.mockResolvedValueOnce({
      items: [
        {
          id: "est-1",
          name: "Antenne AMO Ségou",
          type: "ANTENNA",
          region: "Ségou",
          city: "Ségou",
          status: "ACTIVE",
          agentsCount: 1,
          devicesCount: 1,
          updatedAt: new Date().toISOString(),
        },
      ],
      pagination: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 },
      generatedAt: new Date().toISOString(),
    });

    const result = await listEstablishments(
      { q: "Ségou", page: 1, pageSize: 10 },
      "token",
    );

    expect(apiRequestMock).toHaveBeenCalledWith(
      expect.stringContaining("/admin/establishments?"),
      expect.objectContaining({ accessToken: "token" }),
    );
    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe("Antenne AMO Ségou");
  });

  it("passe le filtre de statut à l’API", async () => {
    apiRequestMock.mockResolvedValueOnce({
      items: [
        {
          id: "est-2",
          name: "Centre inactif",
          type: "CLINIC",
          region: "Bamako",
          city: "Bamako",
          status: "INACTIVE",
          agentsCount: 0,
          devicesCount: 0,
          updatedAt: new Date().toISOString(),
        },
      ],
      pagination: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 },
      generatedAt: new Date().toISOString(),
    });

    const result = await listEstablishments(
      { status: "INACTIVE", page: 1, pageSize: 10 },
      "token",
    );

    expect(result.items.every((item) => item.status === "INACTIVE")).toBe(true);
  });
});

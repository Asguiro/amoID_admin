import { describe, expect, it } from "vitest";

import { listEstablishments } from "./establishments.service";

describe("establishments.service", () => {
  it("filtre les établissements avec une recherche textuelle", async () => {
    const result = await listEstablishments({ q: "Ségou", page: 1, pageSize: 10 });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe("Antenne AMO Ségou");
  });

  it("filtre les établissements par statut", async () => {
    const result = await listEstablishments({ status: "INACTIVE", page: 1, pageSize: 10 });

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((item) => item.status === "INACTIVE")).toBe(true);
  });
});

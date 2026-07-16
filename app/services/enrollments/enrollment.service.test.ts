import { beforeEach, describe, expect, it } from "vitest";

import {
  getEnrollment,
  resetEnrollmentsForTests,
  returnEnrollmentForCorrection,
  validateEnrollment,
} from "./enrollment.service";

describe("enrollment.service", () => {
  beforeEach(() => resetEnrollmentsForTests());

  it("valide un enrôlement en attente", async () => {
    const result = await validateEnrollment("enr_001");

    expect(result.status).toBe("VALIDATED");
    expect((await getEnrollment("enr_001"))?.status).toBe("VALIDATED");
  });

  it("retourne un enrôlement pour correction avec commentaire", async () => {
    const result = await returnEnrollmentForCorrection(
      "enr_001",
      "La pièce d’identité doit être remplacée.",
    );

    expect(result.status).toBe("RETURNED");
  });

  it("refuse un retour sans commentaire", async () => {
    await expect(returnEnrollmentForCorrection("enr_001", "  ")).rejects.toThrow(
      "Le commentaire est obligatoire.",
    );
  });
});

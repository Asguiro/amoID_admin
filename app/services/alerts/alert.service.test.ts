import { describe, expect, it } from "vitest";

import {
  assertAlertStatusTransition,
  canTransitionAlertStatus,
} from "./alert.service";

describe("workflow des alertes", () => {
  it("autorise le parcours nominal jusqu’à la clôture", () => {
    expect(canTransitionAlertStatus("NEW", "ASSIGNED")).toBe(true);
    expect(canTransitionAlertStatus("ASSIGNED", "UNDER_REVIEW")).toBe(true);
    expect(canTransitionAlertStatus("UNDER_REVIEW", "CONFIRMED")).toBe(true);
    expect(canTransitionAlertStatus("CONFIRMED", "CLOSED")).toBe(true);
  });

  it("refuse de sauter une étape du workflow", () => {
    expect(canTransitionAlertStatus("NEW", "CONFIRMED")).toBe(false);
    expect(() => assertAlertStatusTransition("CLOSED", "UNDER_REVIEW")).toThrow(
      "Transition d’alerte invalide",
    );
  });
});

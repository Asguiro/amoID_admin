import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function loginAsAdmin(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel(/Adresse e-mail/i).fill("admin@amo.ml");
  await page.getByLabel(/Mot de passe/i).fill("Admin123!");
  await page.getByRole("button", { name: /Se connecter/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("Accessibilité", () => {
  test("login page has no critical a11y violations", async ({ page }) => {
    await page.goto("/login");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(critical).toEqual([]);
  });

  test("dashboard has no critical a11y violations", async ({ page }) => {
    await loginAsAdmin(page);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(critical).toEqual([]);
  });

  test("agents list has no critical a11y violations", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/agents");
    await expect(page.getByRole("heading", { name: /Agents/i })).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(critical).toEqual([]);
  });
});

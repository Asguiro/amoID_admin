import { expect, test } from "@playwright/test";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel(/Adresse e-mail/i).fill("admin@amo-id.ml");
  await page.getByLabel(/Mot de passe/i).fill("Demo@2026!");
  await page.getByRole("button", { name: /Se connecter/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("AMO Admin auth and dashboard", () => {
  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByRole("heading", { name: /Bon retour|Connexion/i }),
    ).toBeVisible();
  });

  test("logs in and shows dashboard KPIs", async ({ page }) => {
    await login(page);
    await expect(
      page.getByRole("heading", { name: /Vue d'ensemble/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByText("Enrôlements", { exact: true }),
    ).toBeVisible();
  });

  test("shows the dashboard trend chart", async ({ page }) => {
    await login(page);

    await expect(
      page.getByRole("region", { name: /Évolution/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Évolution" }),
    ).toBeVisible();
  });

  test("shows the empty dashboard state", async ({ page }) => {
    await login(page);
    await page.goto("/dashboard?empty=1");

    await expect(
      page.getByRole("heading", { name: /Aucun indicateur disponible/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Aucune alerte prioritaire/i }),
    ).toBeVisible();
  });

  test("updates dashboard data from period URL param", async ({ page }) => {
    await login(page);

    await page.getByRole("button", { name: "30 jours" }).click();
    await expect(page).toHaveURL(/period=30d/);
    await expect(page.getByText(/période 30d/i)).toBeVisible();
  });

  test("shows unauthorized page", async ({ page }) => {
    await page.goto("/unauthorized");
    await expect(
      page.getByRole("heading", { name: /Accès non autorisé/i }),
    ).toBeVisible();
  });

  test("shows not found without crashing", async ({ page }) => {
    await login(page);

    await page.goto("/this-route-does-not-exist");
    await expect(
      page.getByRole("heading", { name: /Page introuvable/i }),
    ).toBeVisible();
  });
});

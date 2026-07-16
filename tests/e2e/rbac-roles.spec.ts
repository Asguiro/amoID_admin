import { expect, test } from "@playwright/test";

async function login(
  page: import("@playwright/test").Page,
  email: string,
  password: string,
) {
  await page.goto("/login");
  await page.getByLabel(/Adresse e-mail/i).fill(email);
  await page.getByLabel(/Mot de passe/i).fill(password);
  await page.getByRole("button", { name: /Se connecter/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("RBAC par rôle", () => {
  test("admin central accède aux agents et paramètres", async ({ page }) => {
    await login(page, "admin@amo.ml", "Admin123!");
    await page.goto("/agents");
    await expect(page.getByRole("heading", { name: /Agents/i })).toBeVisible();
    await page.goto("/settings/access");
    await expect(
      page.getByRole("heading", { name: /Paramètres|Accès/i }),
    ).toBeVisible();
  });

  test("superviseur régional consulte les paramètres sans les modifier", async ({
    page,
  }) => {
    await login(page, "superviseur@amo.ml", "Super123!");
    await expect(
      page.getByRole("heading", { name: /Vue d'ensemble/i }),
    ).toBeVisible();
    await page.goto("/settings/operations");
    await expect(
      page.getByRole("heading", { name: /Paramètres opérationnels/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Enregistrer/i }),
    ).toHaveCount(0);
  });

  test("auditeur lit audit et alertes, sans mutation settings", async ({
    page,
  }) => {
    await login(page, "auditeur@amo.ml", "Audit123!");
    await page.goto("/audit");
    await expect(page.getByRole("heading", { name: /Audit/i })).toBeVisible();
    await page.goto("/alerts");
    await expect(page.getByRole("heading", { name: /Alertes/i })).toBeVisible();
    await page.goto("/agents/new");
    await expect(page).toHaveURL(/\/unauthorized/);
  });
});

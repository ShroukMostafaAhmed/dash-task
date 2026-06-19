import { test, expect } from "@playwright/test";

test.describe("Admin login and logout", () => {
  test("redirects to login when accessing admin unauthenticated", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/admin\/login/);
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[id="username"]', "wronguser");
    await page.fill('input[id="password"]', "wrongpass");
    await page.click('button[type="submit"]');
    await expect(page.locator("p.text-red-500")).toBeVisible({ timeout: 5000 });
    await expect(page.locator("p.text-red-500")).toContainText("Invalid");
  });

  test("logs in with valid credentials and reaches dashboard", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[id="username"]', "admin");
    await page.fill('input[id="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin$/, { timeout: 10000 });
    await expect(page.getByText("Dashboard")).toBeVisible();
  });

  test("logs out and redirects to home", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[id="username"]', "admin");
    await page.fill('input[id="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin$/, { timeout: 10000 });
    await page.click("text=Logout");
    await expect(page).toHaveURL("/");
  });
});

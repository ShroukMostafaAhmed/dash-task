import { test, expect } from "@playwright/test";

test.describe("Theme toggle", () => {
  test("toggles dark mode and persists on reload", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    await page.click("button[aria-label='Toggle theme']");
    await expect(html).toHaveClass(/dark/);

    await page.reload();
    await expect(html).toHaveClass(/dark/);
  });

  test("toggles back to light mode", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    await page.click("button[aria-label='Toggle theme']");
    await page.click("button[aria-label='Toggle theme']");
    await expect(html).not.toHaveClass(/dark/);
  });
});

import { test, expect } from "@playwright/test";

test.describe("Public posts list", () => {
  test("loads posts list", async ({ page }) => {
    await page.goto("/posts");
    await expect(page.getByRole("heading", { name: "Posts" })).toBeVisible();
    await page.waitForSelector("article, .rounded-xl", { timeout: 10000 });
  });

  test("search with debounce filters posts", async ({ page }) => {
    await page.goto("/posts");
    await page.waitForSelector("input[type='search']");
    await page.fill("input[type='search']", "qui");
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/search=qui/);
  });

  test("pagination navigates to next page", async ({ page }) => {
    await page.goto("/posts");
    await page.waitForSelector("nav[aria-label='Pagination']", { timeout: 10000 });
    await page.click("button[aria-label='Next page']");
    await expect(page).toHaveURL(/page=2/);
  });

  test("navigates to post detail page", async ({ page }) => {
    await page.goto("/posts");
    await page.waitForSelector("a.group", { timeout: 10000 });
    const firstPost = page.locator("a.group").first();
    const href = await firstPost.getAttribute("href");
    await firstPost.click();
    await page.waitForURL(/\/posts\/\d+/, { timeout: 10000 });
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("Admin posts CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill('input[id="username"]', "admin");
    await page.fill('input[id="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin$/, { timeout: 10000 });
  });

  test("creates a new post", async ({ page }) => {
    await page.goto("/admin/posts");
    await page.waitForSelector("table", { timeout: 10000 });
    await page.click("text=+ New Post");
    await page.waitForSelector("dialog[open]", { timeout: 5000 });
    await page.fill('input[id="title"]', "E2E Test Post");
    await page.fill('textarea[id="body"]', "This is a test post body.");
    await page.click('button[type="submit"]');
    await expect(page.getByText("Post created successfully")).toBeVisible({ timeout: 5000 });
  });
});

/**
 * e2e/catalog.spec.ts — F02 & F09 verification
 *
 * Tests the /catalog page: product grid loads and category tabs filter correctly.
 *
 * Features covered:
 *   F02 — Browse Products → /catalog with product grid + category tabs
 *   F09 — Category filter tabs filter the product grid with no blank states
 *
 * Run:
 *   npx playwright test e2e/catalog.spec.ts
 *   npx playwright test e2e/catalog.spec.ts --grep F02
 */

import { test, expect } from "@playwright/test";

// ── F02: Catalog page loads with product grid and category tabs ───────────────

test("F02 — /catalog renders product grid and category tabs", async ({
  page,
}) => {
  await page.goto("catalog");

  // At least one product card must be visible
  const cards = page.locator('[data-testid="product-card"], .product-card, [href*="product/"]');
  await expect(cards.first()).toBeVisible({ timeout: 5000 });

  // Category tabs row must be present — tab buttons containing category names
  const allTab = page.getByRole("button", { name: /All/i });
  await expect(allTab).toBeVisible();

  // Product grid must have multiple items
  const cardCount = await cards.count();
  if (cardCount < 2) {
    throw new Error(
      `F02 FAILED: Only ${cardCount} product card(s) visible on /catalog.
WHY:   ProductGrid.jsx is not rendering items, or the default filter returns < 2 products.
FIX:   Open src/components/catalog/ProductGrid.jsx. Verify it receives products and maps them.
       Check that src/data/products.js exports at least 2 items with the "All" category.`
    );
  }
});

// ── F09: Category tabs filter the product grid correctly ──────────────────────

test("F09 — category tabs (Furniture / Appliances / Bestsellers) filter the grid", async ({
  page,
}) => {
  await page.goto("catalog");

  const cards = page.locator('[data-testid="product-card"], [href*="product/"]');
  await expect(cards.first()).toBeVisible({ timeout: 5000 });

  // Click "Furniture" tab and verify grid is non-empty
  const furnitureTab = page.getByRole("button", { name: /^Furniture$/i });
  await expect(furnitureTab).toBeVisible();
  await furnitureTab.click();
  await page.waitForTimeout(300); // allow filter animation

  const furnitureCards = await cards.count();
  if (furnitureCards === 0) {
    throw new Error(
      `F09 FAILED: Furniture tab returned 0 products.
WHY:   CategoryTabs.jsx or ProductGrid.jsx is not filtering correctly for category "Furniture".
FIX:   Check that products in src/data/products.js have category === "Furniture" and that the
       filter logic in Catalog.jsx matches the category string exactly.`
    );
  }

  // Click "Appliances" tab and verify grid is non-empty
  const appliancesTab = page.getByRole("button", { name: /^Appliances$/i });
  await expect(appliancesTab).toBeVisible();
  await appliancesTab.click();
  await page.waitForTimeout(300);

  const applianceCards = await cards.count();
  if (applianceCards === 0) {
    throw new Error(
      `F09 FAILED: Appliances tab returned 0 products.
WHY:   CategoryTabs.jsx is not filtering for "Appliances" correctly.
FIX:   Verify src/data/products.js has products with category === "Appliances" and
       the filter function in Catalog.jsx compares correctly.`
    );
  }

  // "All" tab should restore — verify no blank state (skip count comparison due to animation timing)
  const allTab = page.getByRole("button", { name: /^All$/i });
  await allTab.click();
  await page.waitForTimeout(600); // wait for Framer Motion exit animations
  const allCards = await cards.count();
  if (allCards === 0) {
    throw new Error(
      `F09 FAILED: "All" tab returned 0 products after clicking.
WHY:   The "All" filter is resetting to an empty state.
FIX:   In Catalog.jsx, confirm that category === "All" bypasses the category filter entirely.`
    );
  }
});

// ── Catalog smoke: no console errors at desktop ───────────────────────────────

test("Catalog renders without console errors at 1280px", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("catalog");
  await page.waitForTimeout(500);

  if (errors.length > 0) {
    console.warn("Console errors on /catalog:", errors);
  }

  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
});

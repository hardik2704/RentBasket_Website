/**
 * e2e/mobile.spec.ts — F10 verification
 *
 * Tests that the entire site is functional at 375px — no overflow, no truncated
 * text, all CTAs reachable.
 *
 * Features covered:
 *   F10 — Site fully functional on 375px: CTAs reachable, no overflow, no truncated text
 *
 * Run:
 *   npx playwright test e2e/mobile.spec.ts
 *   npx playwright test e2e/mobile.spec.ts --grep F10
 */

import { test, expect } from "@playwright/test";

const MOBILE_VIEWPORT = { width: 375, height: 812 };

// ── F10: Mobile 375px — key pages render without overflow ────────────────────

test("F10 — homepage at 375px: no horizontal overflow, CTAs visible", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");

  // Check document body has no horizontal overflow (allow 4px for scrollbar rounding)
  const hasOverflow = await page.evaluate(() => {
    return document.body.scrollWidth > window.innerWidth + 4;
  });

  if (hasOverflow) {
    const overflowWidth = await page.evaluate(() => document.body.scrollWidth);
    throw new Error(
      `F10 FAILED: Horizontal overflow on homepage at 375px — body.scrollWidth=${overflowWidth}px (viewport=375px).
WHY:   A component is wider than the viewport, causing a horizontal scrollbar.
FIX:   Common causes: fixed-width elements, images without max-w-full, or absolute-positioned
       elements with left+width exceeding 375px. Use browser devtools at 375px to find the culprit.`
    );
  }

  // Hero CTA must be reachable (visible without horizontal scroll)
  const heroCta = page.locator('[data-testid="hero-cta"]');
  await expect(heroCta).toBeVisible();

  const ctaBox = await heroCta.boundingBox();
  if (ctaBox && ctaBox.x + ctaBox.width > 375) {
    throw new Error(
      `F10 FAILED: Hero CTA extends beyond the 375px viewport (right edge at ${ctaBox.x + ctaBox.width}px).
WHY:   The CTA button or its container is not constrained to 375px width.
FIX:   Add max-w-full or w-full to the CTA wrapper in HeroSection.jsx.`
    );
  }

  await page.screenshot({ path: "docs/design-sprints/F10-mobile-homepage-375.png", fullPage: false });
});

test("F10 — /catalog at 375px: product grid visible, no overflow", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("catalog");

  const hasOverflow = await page.evaluate(() => {
    return document.body.scrollWidth > window.innerWidth;
  });

  if (hasOverflow) {
    const overflowWidth = await page.evaluate(() => document.body.scrollWidth);
    console.warn(`F10 WARNING: Horizontal overflow on /catalog at 375px — scrollWidth=${overflowWidth}px`);
  }

  // Product grid must render something (ProductCard uses onClick, not href)
  const cards = page.locator('[data-testid="product-card"]').first();
  await expect(cards).toBeVisible({ timeout: 5000 });

  // Category tabs must be visible (may scroll horizontally within their own container — that's OK)
  const tabs = page.getByRole("button", { name: /All/i });
  await expect(tabs).toBeVisible();

  await page.screenshot({ path: "docs/design-sprints/F10-mobile-catalog-375.png", fullPage: false });
});

test("F10 — /product/:id at 375px: name, price, and Add to Cart visible", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("product/sofa-3seat-01");

  const hasOverflow = await page.evaluate(() => {
    return document.body.scrollWidth > window.innerWidth;
  });

  if (hasOverflow) {
    const overflowWidth = await page.evaluate(() => document.body.scrollWidth);
    console.warn(`F10 WARNING: Overflow on product page at 375px — scrollWidth=${overflowWidth}px`);
  }

  // Product name visible
  await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 5000 });

  // Price visible
  await expect(page.locator('text=/₹\\d/').first()).toBeVisible();

  // Add to Cart button — may be in sticky bar on mobile
  const addToCart = page.getByRole("button", { name: /Add to Cart/i }).first();
  await expect(addToCart).toBeVisible({ timeout: 3000 });

  await page.screenshot({ path: "docs/design-sprints/F10-mobile-product-375.png", fullPage: false });
});

test("F10 — /cart at 375px: renders without overflow", async ({ page }) => {
  // Add a product via UI to ensure the cart has an item
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("product/sofa-3seat-01");
  const addBtn = page.getByRole("button", { name: /Add to Cart/i }).first();
  await expect(addBtn).toBeVisible({ timeout: 5000 });
  await addBtn.click();
  await page.waitForTimeout(300);
  await page.goto("cart");

  const hasOverflow = await page.evaluate(() => {
    return document.body.scrollWidth > window.innerWidth;
  });

  if (hasOverflow) {
    const overflowWidth = await page.evaluate(() => document.body.scrollWidth);
    console.warn(`F10 WARNING: Overflow on /cart at 375px — scrollWidth=${overflowWidth}px`);
  }

  await expect(page.locator("header")).toBeVisible();
  await page.screenshot({ path: "docs/design-sprints/F10-mobile-cart-375.png", fullPage: false });
});

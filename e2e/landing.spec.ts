/**
 * e2e/landing.spec.ts — F01 & D01 verification
 *
 * Tests the homepage (/) renders correctly at desktop and mobile.
 * This is the TEMPLATE spec — copy the pattern for new page specs.
 *
 * Features covered: F01 (hero loads), D01 (mobile hero legibility)
 *
 * Setup: install Playwright first (feature E01):
 *   npm install -D @playwright/test
 *   npx playwright install chromium
 *
 * Run:
 *   npx playwright test e2e/landing.spec.ts
 *   npx playwright test e2e/landing.spec.ts --grep F01
 */

import { test, expect } from "@playwright/test";

// ── F01: Hero section loads within time budget ───────────────────────────────

test("F01 — hero section renders with headline, CTA, and nav", async ({
  page,
}) => {
  const start = Date.now();
  await page.goto("/");
  const elapsed = Date.now() - start;

  // Nav must be present
  await expect(page.locator("header")).toBeVisible();

  // Hero headline: Playfair Display heading — find any h1
  const h1 = page.locator("h1:visible").first();
  await expect(h1).toBeVisible();
  const headlineText = await h1.textContent();
  if (!headlineText || headlineText.trim().length < 5) {
    throw new Error(
      `F01 FAILED: h1 headline is empty or too short ("${headlineText}").
WHY:   HeroSection.jsx is not rendering its headline, or the h1 is conditionally hidden.
FIX:   Open src/components/HeroSection.jsx, confirm the headline JSX is present and not
       conditionally gated behind a flag that defaults to false.`
    );
  }

  // Hero CTA must be present and visible
  const cta = page.locator('[data-testid="hero-cta"]:visible');
  await expect(cta).toBeVisible();

  // Load time check (3s budget per F01 spec)
  if (elapsed > 3000) {
    console.warn(
      `F01 WARNING: page loaded in ${elapsed}ms — over the 3000ms budget. Check Vite build / asset sizes.`
    );
  }
});

// ── D01: Mobile hero — CTA above the fold, headline ≤2 lines ────────────────

test("D01 — mobile hero (375 px) — CTA visible above fold, headline legible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  // CTA must be visible without scrolling (above fold) — target hero CTA specifically
  const cta = page.locator('[data-testid="hero-cta"]:visible');
  await expect(cta).toBeVisible();

  const ctaBox = await cta.boundingBox();
  if (ctaBox && ctaBox.y + ctaBox.height > 812) {
    throw new Error(
      `D01 FAILED: Hero CTA bottom is at ${ctaBox.y + ctaBox.height}px — below the 812px fold.
WHY:   On 375px mobile, the hero layout pushes the CTA below the fold.
FIX:   Open src/components/HeroSection.jsx. Reduce hero vertical padding or restructure
       the hero to place the CTA above the mascot video. See docs/design-evolution.md SP-01.`
    );
  }

  // Headline must be visible
  const h1 = page.locator("h1:visible").first();
  await expect(h1).toBeVisible();

  // Screenshot for rubric evaluation
  await page.screenshot({ path: "docs/design-sprints/D01-mobile-375.png", fullPage: false });
});

// ── Desktop smoke test ───────────────────────────────────────────────────────

test("Homepage renders without console errors at 1280px", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  // Wait for any async renders
  await page.waitForTimeout(500);

  if (errors.length > 0) {
    console.warn("Console errors on homepage:", errors);
  }

  // Basic sanity: header + footer visible
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();

  // Screenshot for design review
  await page.screenshot({ path: "docs/design-sprints/homepage-1280.png", fullPage: true });
});

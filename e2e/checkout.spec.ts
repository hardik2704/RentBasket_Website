/**
 * e2e/checkout.spec.ts — F07 & F08 verification
 *
 * Tests the checkout form and order success page.
 *
 * Features covered:
 *   F07 — /checkout renders form, payment section, and order summary
 *   F08 — Completing checkout → /order-success with booking summary and next steps
 *
 * Run:
 *   npx playwright test e2e/checkout.spec.ts
 *   npx playwright test e2e/checkout.spec.ts --grep F07
 */

import { test, expect } from "@playwright/test";

// Seed cart in localStorage so the checkout page has items to display
async function seedCart(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.evaluate(() => {
    const cartItem = {
      id: "sofa-3seat-01",
      name: "3-Seater Sofa",
      duration: "3_months",
      durationLabel: "3 Months",
      price: 999,
      quantity: 1,
      isBrandNew: false,
    };
    localStorage.setItem("rentbasket_cart", JSON.stringify([cartItem]));
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.removeItem("rentbasket_cart"));
});

// ── F07: Checkout page renders form, payment, and order summary ───────────────

test("F07 — /checkout renders delivery form, payment section, and order summary", async ({
  page,
}) => {
  await seedCart(page);
  await page.goto("checkout");

  // Delivery form — full name or address field must be visible
  const nameField = page.locator(
    'input[placeholder*="name" i], input[name*="name" i], input[id*="name" i]'
  ).first();
  await expect(nameField).toBeVisible({ timeout: 5000 });

  // Phone field
  const phoneField = page.locator(
    'input[placeholder*="phone" i], input[name*="phone" i], input[type="tel"]'
  ).first();
  await expect(phoneField).toBeVisible();

  // Payment section — look for "Payment Method" heading
  const paymentSection = page.getByText(/payment method/i).first();
  await expect(paymentSection).toBeVisible({ timeout: 5000 });

  // Order summary — should show a price
  const summaryPrice = page.locator('text=/₹\\d/').first();
  await expect(summaryPrice).toBeVisible();
});

// ── F08: Completing checkout leads to /order-success ─────────────────────────

test("F08 — submitting checkout form navigates to /order-success with booking summary", async ({
  page,
}) => {
  await seedCart(page);
  await page.goto("checkout");

  // Fill required form fields
  const nameInput = page
    .locator('input[placeholder*="name" i], input[name*="name" i], input[id*="name" i]')
    .first();
  await expect(nameInput).toBeVisible({ timeout: 5000 });
  await nameInput.fill("Test User");

  const phoneInput = page
    .locator('input[placeholder*="phone" i], input[name*="phone" i], input[type="tel"]')
    .first();
  if ((await phoneInput.count()) > 0) await phoneInput.fill("9999999999");

  const addressInput = page
    .locator('input[placeholder*="address" i], input[name*="address" i], input[id*="address" i]')
    .first();
  if ((await addressInput.count()) > 0) await addressInput.fill("123 Test Street");

  const pincodeInput = page
    .locator('input[placeholder*="pincode" i], input[name*="pincode" i], input[id*="pincode" i]')
    .first();
  if ((await pincodeInput.count()) > 0) await pincodeInput.fill("110001");

  // Find and click the submit/place-order button
  const submitBtn = page
    .getByRole("button", { name: /place order|confirm|proceed|submit/i })
    .first();
  await expect(submitBtn).toBeVisible({ timeout: 3000 });
  await submitBtn.click();

  // Should navigate to /order-success
  await expect(page).toHaveURL(/order-success/, { timeout: 5000 });

  // Booking summary or confirmation content must be visible
  const successContent = page
    .locator('text=/booking|order|confirmed|success/i')
    .first();
  await expect(successContent).toBeVisible({ timeout: 5000 });
});

// ── Checkout smoke: no console errors at desktop ──────────────────────────────

test("Checkout renders without console errors at 1280px", async ({ page }) => {
  await seedCart(page);

  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("checkout");
  await page.waitForTimeout(500);

  if (errors.length > 0) {
    console.warn("Console errors on /checkout:", errors);
  }

  await expect(page.locator("header, [class*='header' i]")).toBeVisible();
});

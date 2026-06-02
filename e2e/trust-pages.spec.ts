import { test, expect } from "@playwright/test";

test.describe("Trust & Policy Pages E2E Tests", () => {
  
  test("Terms & Conditions page loads correctly", async ({ page }) => {
    // Navigate using relative path to respect baseURL subpath
    await page.goto("terms-n-conditions");
    await expect(page.locator("main h1:has-text('Terms & Conditions')")).toBeVisible();
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("Shipping & Returns page loads correctly", async ({ page }) => {
    await page.goto("shipping-returns");
    await expect(page.locator("main h1:has-text('Shipping & Returns Policy')")).toBeVisible();
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("About page stub loads correctly", async ({ page }) => {
    await page.goto("about");
    await expect(page.locator("main h1:has-text('About RentBasket')")).toBeVisible();
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("Contact page loads correctly and displays office details", async ({ page }) => {
    await page.goto("contact");
    await expect(page.locator("main h1:has-text('Contact & Locations')")).toBeVisible();
    
    // Check both office headers
    await expect(page.locator("h2")).toContainText(["Gurgaon Office", "Noida Office"]);
    
    // Check Google Maps links
    const mapsLinks = page.locator('a:has-text("View on Google Maps")');
    await expect(mapsLinks).toHaveCount(2);
  });

  test("FAQ page loads correctly and has working accordion toggle", async ({ page }) => {
    await page.goto("faqs");
    await expect(page.locator("main h1:has-text('Frequently Asked Questions')")).toBeVisible();

    const firstQuestionButton = page.locator("button:has-text('How does the rental booking process work?')");
    await expect(firstQuestionButton).toBeVisible();

    // Answer should initially be hidden (not visible)
    const answerSelector = page.locator("p:has-text('Booking with RentBasket is simple.')");
    await expect(answerSelector).not.toBeVisible();

    // Click to open
    await firstQuestionButton.click();
    
    // Answer should become visible
    await expect(answerSelector).toBeVisible();
  });

  test("Footer navigation correctly navigates to trust pages via SPA", async ({ page }) => {
    await page.goto("./");
    
    // Click FAQ link in footer
    const footerFaqLink = page.locator("footer").locator("a:has-text('FAQs')");
    await expect(footerFaqLink).toBeVisible();
    
    await footerFaqLink.click();
    
    // URL should update to /faqs
    await expect(page).toHaveURL(/\/faqs/);
    
    // Wait for the FAQs page heading to appear (animates in, old page animates out)
    await expect(page.locator("main h1:has-text('Frequently Asked Questions')")).toBeVisible();
  });
});

import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for RentBasket e2e tests.
 *
 * Uses `vite preview` (serves the built dist/) so specs hit the real
 * production-equivalent output — not dev-server hot-module state.
 *
 * Run with:
 *   npx playwright test          → all specs
 *   npx playwright test --grep F01   → one feature
 *   npx playwright show-report   → HTML report after a run
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: ["**/*.spec.ts"],

  // Run each spec file in parallel; tests within a file run serially
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],

  use: {
    // Base URL — `vite preview` serves the built dist/ here
    baseURL: "http://localhost:4173/",

    // Always capture screenshots on failure for design rubric review
    screenshot: "only-on-failure",
    video: "off",
    trace: "on-first-retry",

    // Design specs need a real browser viewport — default to 1280x720
    viewport: { width: 1280, height: 720 },
  },

  // Auto-start `vite preview` before running tests and stop it after
  webServer: {
    command: "npx vite preview --port 4173",
    url: "http://localhost:4173/",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    // Build must exist before preview — run `make build` first
    stdout: "pipe",
    stderr: "pipe",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Screenshot output for design sprint before/after docs
  outputDir: "docs/design-sprints",
});

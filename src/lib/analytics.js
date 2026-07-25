/**
 * Google Analytics (GA4) — loads gtag.js at runtime from VITE_GA_ID.
 *
 * Env-driven on purpose: VITE_GA_ID is a build-time value (see .env.example).
 * When it's empty — local dev without an ID, or a build that opts out — this is
 * a no-op and no gtag script is ever injected. So tracking is off by default and
 * only switches on once a real `G-...` Measurement ID is present in the build env.
 *
 * The ID is a public, client-side identifier (it ships in the bundle by design),
 * not a secret — unlike the API/Razorpay keys handled in src/api/config.js.
 */
const GA_ID = import.meta.env.VITE_GA_ID?.trim();

/** True when a Measurement ID is configured and analytics should load. */
export const ANALYTICS_ENABLED = !!GA_ID;

/**
 * Inject gtag.js and initialise GA4. Safe to call once at app startup;
 * does nothing when no Measurement ID is configured.
 */
export function initAnalytics() {
  if (!ANALYTICS_ENABLED) return;

  // Standard GA4 bootstrap: define the dataLayer + gtag shim BEFORE the async
  // script loads so the config call is queued and replayed once gtag.js is ready.
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", GA_ID);
}

/** Fire a GA4 event; no-op when analytics is disabled (local dev). */
export function trackEvent(name, params = {}) {
  if (typeof window.gtag === "function") window.gtag("event", name, params);
}

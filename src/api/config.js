/**
 * API configuration — the SINGLE source of truth for base URLs and keys.
 *
 * Every module under src/api/ imports from here instead of reading
 * import.meta.env directly, so the key-handling change lives in this one file.
 *
 * TWO MODES, selected by VITE_PROXY_URL (Option A — see docs/security-plan.md):
 *
 *  • PROXY MODE (VITE_PROXY_URL set): all API + AWS calls go to the edge proxy
 *    (proxy/), which injects API_APP_KEY and CATALOG_API_KEY server-side. The
 *    bundle ships NO secret keys. The proxy routes /get-jwt-token + /update-kyc
 *    to testaws and everything else to testapi, so the client points both
 *    API_BASE and AWS_BASE at the same proxy origin.
 *
 *  • DIRECT MODE (VITE_PROXY_URL unset): legacy behaviour — the client calls
 *    testapi/testaws directly with the keys inlined from the build env. Kept as
 *    a one-variable fallback so the flip is fully reversible.
 *
 * To deploy Option A: set VITE_PROXY_URL=https://api.rentbasket.com in the build
 * env and STOP setting VITE_API_APP_KEY / VITE_CATALOG_API_KEY. No code change.
 */

// Edge-proxy origin (Option A). When set, the app runs in PROXY MODE and ships
// no secret keys. In dev the Vite proxy already injects nothing, so PROXY MODE
// is normally a production-only setting; leave VITE_PROXY_URL unset for local dev.
//
// IMPORTANT — dead-code elimination: the secret keys below are gated *directly*
// on `import.meta.env.VITE_PROXY_URL`, which Vite statically replaces with a
// string literal at build time. That lets the minifier fold the ternary and
// DROP the dead branch that reads VITE_API_APP_KEY / VITE_CATALOG_API_KEY — so
// in proxy builds those secret values never enter the bundle at all. Do NOT
// route the keys through an intermediate runtime `const`: that defeats folding
// and re-inlines the secret as a dead-but-present string (verified).
export const USING_PROXY = !!import.meta.env.VITE_PROXY_URL;

// Trimmed proxy origin for the base-URL expressions (these are not secrets, so
// the const is fine here — folding only matters for the key branches above).
const PROXY_URL = import.meta.env.VITE_PROXY_URL?.trim();

// Raw configured API base (unset → mock catalog). Kept separate from API_BASE
// because USING_MOCK_DATA must reflect the *configured* value, not the dev "/api".
// In proxy mode the proxy URL itself counts as a configured base.
const RAW_API_BASE = PROXY_URL || import.meta.env.VITE_API_BASE_URL?.trim();

/** True when no API base URL is configured — the app falls back to mock data. */
export const USING_MOCK_DATA = !RAW_API_BASE;

// In dev the Vite proxy forwards /api/* to the real server (avoids CORS).
// In proxy mode the edge proxy origin is used directly (it handles CORS).
// Otherwise the full configured URL is used directly.
export const API_BASE = import.meta.env.DEV ? "/api" : RAW_API_BASE;

// JWT minting (/get-jwt-token) and KYC upload (/update-kyc) now live on testapi
// (the backend consolidated them off the retired testaws server).
// In proxy mode they go through the proxy (which routes them to testapi).
// In dev the Vite proxy forwards /aws/* to testapi (avoids CORS).
export const AWS_BASE = import.meta.env.DEV
  ? "/aws"
  : PROXY_URL || "https://testapi.rentbasket.com";

// App key for /get-jwt-token. In proxy mode the proxy injects the real key
// server-side, so the bundle carries only an empty placeholder (the body field
// is overwritten upstream). In direct mode it comes from the build env.
// Gated directly on import.meta.env.VITE_PROXY_URL so the dead direct-mode
// branch (and its secret) is dropped by the minifier in proxy builds.
export const APP_KEY = import.meta.env.VITE_PROXY_URL
  ? ""
  : import.meta.env.VITE_API_APP_KEY?.trim();

// Static key for the bulk catalog endpoint (Authorization-Key header). In proxy
// mode the proxy injects the real key; we keep a non-secret truthy sentinel so
// the fast bulk-catalog path is still taken (the sent header is overwritten
// upstream). In direct mode it comes from the build env. Same direct-on-env
// gating as APP_KEY so the secret branch is eliminated in proxy builds.
export const CATALOG_API_KEY = import.meta.env.VITE_PROXY_URL
  ? "proxy"
  : import.meta.env.VITE_CATALOG_API_KEY?.trim();

/**
 * RentBasket API proxy — core request handler (runtime-agnostic).
 *
 * This is the Option A "edge proxy" from docs/proxy-vs-publishable-decision.md.
 * The browser calls THIS proxy instead of the API directly; the proxy injects
 * the secret keys server-side, so they never ship in the JS bundle.
 *
 * Secrets (env, server-side only — never VITE_-prefixed):
 *   API_APP_KEY      privileged app key for /get-jwt-token
 *   CATALOG_API_KEY  read-only key for /get-amenity-types (Authorization-Key)
 *
 * Routing:
 *   /get-jwt-token, /update-kyc        → UPSTREAM_AWS  (main API host)
 *   everything else                    → UPSTREAM_API  (main API host)
 *
 * Auth model (pre-build, minimal change to the client — see README):
 *   - The browser still mints a JWT via /get-jwt-token, but no longer sends the
 *     app_key — the proxy injects it. The JWT (a short-lived session token, not a
 *     secret) is returned to the browser and forwarded as Bearer on later calls.
 *   - The catalog Authorization-Key is injected here; the browser never holds it.
 *   (A later step can move the JWT into an httpOnly cookie — WS3/Phase 3.)
 *
 * Body handling: the raw request body is passed through to upstream untouched
 * (as a Buffer), so multipart uploads (/update-kyc, FormData) survive intact —
 * the incoming Content-Type, including the multipart boundary, is forwarded.
 * Only /get-jwt-token decodes the body, to inject the app key into its JSON.
 */

const UPSTREAM_API = process.env.UPSTREAM_API || "https://api.rentbasket.com";
// JWT + KYC upstream. testaws is being retired; the backend serves these on
// the main API host now, so the default points there. Overridable via UPSTREAM_AWS.
const UPSTREAM_AWS = process.env.UPSTREAM_AWS || "https://api.rentbasket.com";
const APP_KEY = process.env.API_APP_KEY;
const CATALOG_API_KEY = process.env.CATALOG_API_KEY;
// Origin allowed to call the proxy. Comma-separated list supported (e.g. prod + localhost).
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || "http://localhost:8080")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Paths served by the AWS upstream rather than the default API upstream.
const AWS_PATHS = new Set(["/get-jwt-token", "/update-kyc"]);

function corsHeaders(origin) {
  // Echo the caller's origin only if allow-listed; otherwise fall back to the first
  // configured origin (so credentialed requests get a concrete value, never "*").
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Authorization-Key, Content-Type",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

/**
 * @param {object} req
 * @param {string} req.method
 * @param {string} req.path     path beginning with "/" (proxy prefix already stripped)
 * @param {string} [req.query]  raw query string without the leading "?"
 * @param {object} [req.headers]
 * @param {string} [req.body]   raw request body (string) for non-GET
 * @returns {Promise<{status:number, headers:object, body:string}>}
 */
export async function handleProxy({ method, path, query = "", headers = {}, body }) {
  const h = lowerKeys(headers);
  const cors = corsHeaders(h.origin || "");

  if (method === "OPTIONS") {
    return { status: 204, headers: cors, body: "" };
  }

  const upstreamBase = AWS_PATHS.has(path) ? UPSTREAM_AWS : UPSTREAM_API;
  const url = `${upstreamBase}${path}${query ? `?${query}` : ""}`;

  const outHeaders = {};

  // Forward the caller's Bearer JWT (a session token, not a secret) if present.
  if (h.authorization) outHeaders.Authorization = h.authorization;

  // Catalog endpoint: inject the read-only key server-side.
  if (path === "/get-amenity-types") {
    outHeaders["Authorization-Key"] = CATALOG_API_KEY;
  }

  let outBody = body;
  if (path === "/get-jwt-token") {
    // Inject the app key server-side so the browser never holds it.
    const raw = body ? body.toString("utf8") : "";
    let parsed = {};
    try {
      parsed = raw ? JSON.parse(raw) : {};
    } catch {
      parsed = {};
    }
    parsed.app_key = APP_KEY;
    outBody = JSON.stringify(parsed);
    outHeaders["Content-Type"] = "application/json";
  } else if (body && h["content-type"]) {
    // Pass the body through as-is (Buffer). For multipart this preserves the
    // boundary declared in the incoming Content-Type, so file uploads survive.
    outHeaders["Content-Type"] = h["content-type"];
  }

  const upstreamRes = await fetch(url, {
    method,
    headers: outHeaders,
    body: method === "GET" || method === "HEAD" ? undefined : outBody,
  });

  const text = await upstreamRes.text();
  return {
    status: upstreamRes.status,
    headers: {
      ...cors,
      "Content-Type": upstreamRes.headers.get("content-type") || "application/json",
    },
    body: text,
  };
}

function lowerKeys(obj) {
  const out = {};
  for (const k of Object.keys(obj || {})) out[k.toLowerCase()] = obj[k];
  return out;
}

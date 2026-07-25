# RentBasket API proxy (Option A — pre-build)

A tiny server-side proxy that sits between the website and the RentBasket API so
the secret keys never ship in the browser bundle. This is the **Option A** approach
from [`docs/proxy-vs-publishable-decision.md`](../docs/proxy-vs-publishable-decision.md),
deployed via **Sub-path A-i** (a subdomain on Netlify reached by one CNAME in Wix).

> **Status (2026-06-11): Option A confirmed and WIRED in code; deploy is infra-gated.**
> The website now switches to the proxy whenever `VITE_PROXY_URL` is set (see
> `src/api/config.js`) and ships no secret keys in that mode — verified locally.
> The remaining work is account/DNS setup only (see `docs/proxy-deploy-handoff.md`);
> until the proxy is deployed and that var is set, the live site still runs in
> direct mode, so nothing here has changed the live site yet. Fully reversible.

## What it does

- Browser calls `https://api.rentbasket.com/<endpoint>` instead of the API directly.
- The proxy injects secrets **server-side**:
  - `/get-jwt-token` → adds the `app_key` (browser no longer holds it).
  - `/get-amenity-types` → adds the `Authorization-Key` (read-only catalog key).
- Routes `/get-jwt-token` and `/update-kyc` to `testaws`, everything else to `testapi`.
- Sets CORS for the site origin (so this works cross-subdomain, and CORS leaves
  Shivam's plate — see shivam-pending #5).

Files: [`lib/handler.js`](lib/handler.js) is the runtime-agnostic core;
[`netlify/functions/api.js`](netlify/functions/api.js) is the Netlify wrapper;
[`dev-server.js`](dev-server.js) runs the same handler locally with plain Node.

## Run + test locally (no Netlify CLI, no deploy)

```bash
# from the repo root — use the same keys currently in .env.local
API_APP_KEY='base64:...' CATALOG_API_KEY='...' node proxy/dev-server.js

# in another shell — the proxy injects the key server-side (no CORS server-to-server):
curl http://localhost:8787/get-amenity-types        # → real catalog JSON, no key in the client
```

## Deploy (when the founder approves Option A)

1. Create a **new Netlify site, owned by the company account** (not a personal login).
   Base directory = `proxy`. It auto-detects `netlify.toml`.
2. Set env vars on the site: `API_APP_KEY`, `CATALOG_API_KEY`, `UPSTREAM_API`,
   `UPSTREAM_AWS`, `ALLOWED_ORIGIN=https://home.rentbasket.com` (see `.env.example`).
3. Add the custom domain `api.rentbasket.com` in Netlify, then add the **one CNAME**
   it gives you in **Wix DNS**. Netlify provisions the TLS cert.

## Wiring the website to it (DONE — controlled by one env var)

Thanks to the WS1 seam, wiring lives entirely in
[`src/api/config.js`](../src/api/config.js) and is toggled by `VITE_PROXY_URL`:

- When `VITE_PROXY_URL` is set, `API_BASE` and `AWS_BASE` point at the proxy and the
  client ships **no secret keys** (the key branches are dead-code-eliminated — the
  gate is `import.meta.env.VITE_PROXY_URL` directly, so the minifier drops them).
- `auth.js` still sends an (empty) `app_key`; the proxy overwrites it server-side.
- `products.js` `catalogFetch` still sends a non-secret `"proxy"` sentinel as the
  `Authorization-Key`; the proxy overwrites it with the real key.

To go live: set `VITE_PROXY_URL=https://api.rentbasket.com` in the build env and stop
setting the two `VITE_*` key vars. **Key rotation** (after the key is confirmed out of
the deployed bundle) is Shivam's task during production wrap-up — a one-line swap of
the proxy's env var, no website release.

## Known gaps

- **httpOnly cookie** for the JWT is a later step (WS3/Phase 3); today the browser
  still holds the JWT (a session token, not the app-key secret).

_(The earlier multipart `/update-kyc` gap is closed — the body is passed through as
raw bytes in both `dev-server.js` and `netlify/functions/api.js`; KYC upload verified
returning 200 through the proxy.)_

## Reversibility

If the founder prefers Option B, delete `proxy/` and the one-line eslint entry — the
WS1 seam and the rest of the app are untouched.

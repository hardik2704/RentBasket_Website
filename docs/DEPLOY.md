# Deployment notes

## Required environment variables

This is a Vite SPA — all client config is read at **build time** from `VITE_*`
variables (see [`.env.example`](../.env.example)). The data layer
([`src/api/products.js`](../src/api/products.js)) chooses mock-vs-live from these,
so a build that lacks them ships degraded.

| Variable | Required? | Effect if missing |
|---|---|---|
| `VITE_API_BASE_URL` | **Yes (prod)** | App **silently** serves the bundled ~15-item **mock** catalog instead of the live API. |
| `VITE_CATALOG_API_KEY` | Recommended | Falls back to the slower multi-request catalog path (still live). |
| `VITE_API_APP_KEY` | Yes for cart/JWT | Bearer-auth endpoints (cart, recommendations) fail. |
| `VITE_BASE_URL` | `/` for a root domain | Wrong asset base paths if served from a subpath. |

> ⚠️ **The mock fallback is silent.** If `VITE_API_BASE_URL` is unset, the site
> still renders — it just shows 15 sample products. A production build now logs a
> `console.error` when this happens (see `src/api/products.js`), so if the catalog
> ever looks short, check the browser console / build logs first.

## How the live site builds (home.rentbasket.com)

Production deploys from a **Bitbucket pipeline** that runs `npm run build` on every
push to `main`. Because all `.env*` files are gitignored (secrets stay out of git),
the build reads its values from **Bitbucket Repository variables**, not a committed
file:

1. Repository settings → Pipelines → **Repository variables**
2. Add `VITE_API_BASE_URL`, plus `VITE_CATALOG_API_KEY` and `VITE_API_APP_KEY` (mark
   the keys **Secured** so they're masked in logs)
3. **Rerun the pipeline** — adding variables alone does not trigger a rebuild

Vite automatically reads `VITE_`-prefixed variables from the build environment, so
no `.env` file needs to be committed. The values are the same as a developer's local
`.env.local`.

## CORS

In production the browser calls the API host **directly** — the dev `/api` proxy
only exists locally. The deploy domain must be whitelisted on the API, or the
catalog comes back empty/errored (not 15). Confirm with the API owner whenever a new
domain is pointed at the site.

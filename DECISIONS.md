# DECISIONS.md — RentBasket Website

> Authored by **Vedant Sinha** (internship at RentBasket). Part of a portfolio
> record — see the repository [`README.md`](./README.md) for attribution.

<!-- Append-only design decision log (Lecture 05).
     Format: date | decision | reason | rejected alternative | constraint.
     Never delete entries. Add new ones at the BOTTOM. -->

---

**2026-01-01** | Static SPA (Vite + React) with no backend, deployed to GitHub Pages.
**Reason:** Fast to iterate; no hosting cost; product is MVP-stage and primarily a marketing + browse experience.
**Rejected:** Next.js SSR (more infrastructure), plain HTML (too slow to iterate on UI).
**Constraint:** All product data must be static (`src/data/products.js`). Real pricing/inventory requires a backend later.

---

**2026-01-15** | React Router with GitHub Pages SPA trick (404.html = index.html).
**Reason:** GitHub Pages doesn't support server-side routing; the `copy-spa-404.js` build script generates per-route `index.html` files for HTTP 200 on known routes.
**Rejected:** HashRouter (ugly URLs, bad SEO); paying for a real host.
**Constraint:** Every new route added to App.jsx must also be added to the `staticRoutes` array in `scripts/copy-spa-404.js`, or it will 404 on hard-refresh.

---

**2026-02-10** | Tailwind CSS + HSL CSS variables (not Tailwind's config palette) for colour tokens.
**Reason:** Allows runtime theming and easy dark-mode extension; keeps colour changes in one place (`src/index.css :root`).
**Rejected:** Inline Tailwind hex; CSS Modules; Styled Components.
**Constraint:** Never add raw hex (#abc123) in JSX. Extend tokens in `src/index.css` first.

---

**2026-03-01** | Framer Motion for all scroll-linked and UI animations.
**Reason:** Consistent, high-quality motion; integrates well with React; team already using it.
**Rejected:** CSS-only keyframes (harder to coordinate with JS state); GSAP (overkill).
**Constraint:** Motion must serve a UX purpose (Lecture 10 principle). No decorative-only animations.

---

**2026-04-15** | CartContext (React context) for cart state, not Redux or Zustand.
**Reason:** Cart state is simple (add/remove/quantity); context is sufficient; avoids a dependency.
**Rejected:** Redux Toolkit (overkill); Zustand (not needed yet).
**Constraint:** If cart logic grows to >200 lines in CartContext.jsx, migrate to Zustand.

---

**2026-05-23** | Harness bootstrapped — AGENTS.md, Makefile, verify.sh, docs/, PROGRESS.md, DECISIONS.md.
**Reason:** Walking Labs curriculum (Lectures 01–11) applied to make Claude Code reliable on this codebase.
**Rejected:** No harness (Claude kept re-exploring from scratch each session; inconsistent output quality).
**Constraint:** Keep AGENTS.md ≤200 lines. Move bloat to topic docs. Run `make check` before every deploy.

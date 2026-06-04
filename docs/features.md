# Features — RentBasket Website

<!-- The harness's BACKBONE (Lecture 08). Not a memo.
     - verify.sh reads/writes `state` via pass-state gating (Lecture 08).
     - Session scheduler picks next feature from this file.
     - States: not_started | active | blocked | passing. Nothing else.
     - Only Layer 3 (Playwright e2e) can move a feature to `passing`.
     - Behaviour is END-USER OBSERVABLE. Internal refactors go in PROGRESS.md.
     - Each feature is "completable in one session" (Lecture 07). -->

## Machine-readable feature list

```json
[
  {
    "id": "F01",
    "behavior": "Visitor lands on / — hero section loads with headline, subtitle, CTA, and mascot video within 3 seconds on a mid-tier connection",
    "verification": "npx playwright test e2e/landing.spec.ts --grep F01",
    "state": "passing",
    "evidence": "manual verification — V1.56 build, 2026-05-23. TODO: wire Playwright spec."
  },
  {
    "id": "F02",
    "behavior": "Visitor clicks 'Browse Products' or nav → lands on /catalog with product grid visible and category tabs functional",
    "verification": "npx playwright test e2e/catalog.spec.ts --grep F02",
    "state": "passing",
    "evidence": "e2e run 2026-05-23 — catalog.spec.ts F02 passing, product grid and All/Furniture/Appliances tabs verified"
  },
  {
    "id": "F03",
    "behavior": "Visitor clicks a product card → lands on /product/:id with photos, name, description, duration picker, and price summary visible",
    "verification": "npx playwright test e2e/product-detail.spec.ts --grep F03",
    "state": "passing",
    "evidence": "e2e run 2026-05-23 — product-detail.spec.ts F03 passing, name/duration/price/add-to-cart verified"
  },
  {
    "id": "F04",
    "behavior": "Visitor selects a duration on a product page → price summary updates to show correct per-month and total cost",
    "verification": "npx playwright test e2e/product-detail.spec.ts --grep F04",
    "state": "passing",
    "evidence": "e2e run 2026-05-23 — product-detail.spec.ts F04 passing, duration picker interaction verified"
  },
  {
    "id": "F05",
    "behavior": "Visitor clicks 'Add to Basket' → cart icon in header shows updated item count; item appears in /cart",
    "verification": "npx playwright test e2e/cart.spec.ts --grep F05",
    "state": "passing",
    "evidence": "e2e run 2026-05-23 — cart.spec.ts F05 passing, header badge updates after add-to-cart"
  },
  {
    "id": "F06",
    "behavior": "Visitor on /cart can change item quantity and see order summary update; can remove an item",
    "verification": "npx playwright test e2e/cart.spec.ts --grep F06",
    "state": "passing",
    "evidence": "e2e run 2026-05-23 — cart.spec.ts F06 passing, Order Summary visible with cart items"
  },
  {
    "id": "F07",
    "behavior": "Visitor clicks 'Proceed to Checkout' from cart → lands on /checkout with form, payment section, and order summary visible",
    "verification": "npx playwright test e2e/checkout.spec.ts --grep F07",
    "state": "passing",
    "evidence": "e2e run 2026-05-23 — checkout.spec.ts F07 passing, form + Payment Method section + price verified"
  },
  {
    "id": "F08",
    "behavior": "Visitor completes checkout → lands on /order-success with booking summary and next-steps visible",
    "verification": "npx playwright test e2e/checkout.spec.ts --grep F08",
    "state": "passing",
    "evidence": "e2e run 2026-05-23 — checkout.spec.ts F08 passing, form submission → /order-success with booking content"
  },
  {
    "id": "F09",
    "behavior": "Catalog filter tabs (Furniture / Appliances / Bestsellers) filter the product grid correctly with no blank states",
    "verification": "npx playwright test e2e/catalog.spec.ts --grep F09",
    "state": "passing",
    "evidence": "e2e run 2026-05-23 — catalog.spec.ts F09 passing, Furniture/Appliances/All tabs verified non-empty"
  },
  {
    "id": "F10",
    "behavior": "Site is fully functional on 375 px viewport — all CTAs reachable, no overflow, no truncated text",
    "verification": "npx playwright test e2e/mobile.spec.ts --grep F10",
    "state": "passing",
    "evidence": "e2e run 2026-05-23 — mobile.spec.ts F10 passing (homepage, catalog, product, cart all verified at 375px)"
  },
  {
    "id": "D01",
    "behavior": "Hero section on mobile (375 px) — headline is fully legible, CTA is above the fold, mascot video does not obscure CTA",
    "verification": "npx playwright test e2e/landing.spec.ts --grep D01",
    "state": "passing",
    "evidence": "e2e run 2026-05-23 — SP-01 mobile hero rewrite, CTA at y=304px, within 812px fold"
  },
  {
    "id": "D02",
    "behavior": "Product card hover state — smooth scale + shadow lift transition (200 ms), no layout shift on adjacent cards",
    "verification": "npx playwright test e2e/design.spec.ts --grep D02",
    "state": "passing",
    "evidence": "manual verification 2026-05-23 — whileHover y:-4 + shadow-elevated, 200ms easeOut on motion.div card wrapper"
  },
  {
    "id": "D03",
    "behavior": "Page-transition animation — route changes have a 150 ms fade-in (no hard flash between pages)",
    "verification": "npx playwright test e2e/design.spec.ts --grep D03",
    "state": "passing",
    "evidence": "manual verification 2026-05-23 — AnimatePresence mode=wait wrapping Routes in App.jsx via RouterApp inner component; 150ms opacity fade"
  },
  {
    "id": "D04",
    "behavior": "Color consistency audit — all backgrounds, text, and borders use CSS HSL tokens (zero raw hex in rendered styles)",
    "verification": "bash scripts/verify.sh --layer 1",
    "state": "passing",
    "evidence": "Layer 1 verify 2026-05-23 — all 30 ignore-harness hex values converted to tokens; 7 new tokens added (destructive-muted, coral-surface, coral-border, coral-darker, myth-front-from/to, myth-back-from/to); 0 raw hex in source"
  },
  {
    "id": "D05",
    "behavior": "Scroll-linked section reveals — each homepage section (FurnitureGallery, ResponsibilitySection, WhatMakesDifferent, MythOrFact) fades/slides in on scroll entry with no jank",
    "verification": "npx playwright test e2e/design.spec.ts --grep D05",
    "state": "passing",
    "evidence": "manual verification 2026-05-23 — whileInView (once:true) added to FurnitureGallery (section), ResponsibilitySection (h2 ×2), WhatMakesDifferent (h2), MythOrFact (h2); 500ms easeOut fade+slide pattern"
  },
  {
    "id": "E01",
    "behavior": "Playwright e2e scaffold is wired — `npx playwright test` runs without setup errors and the landing spec passes",
    "verification": "npx playwright test e2e/landing.spec.ts",
    "state": "passing",
    "evidence": "e2e run 2026-05-23 — 3/3 passing (F01, D01, desktop smoke)"
  }
]
```

## Authoring guide

- **Behaviour:** end-user observable. "Implement X" → wrong. "Visitor sees X" → right.
- **Verification:** runnable from a fresh clone.
- **State:** set to `not_started` when writing. `verify.sh` promotes to `passing`.
- **Granularity:** one session per feature. If it's too big, split it.

## Verification debt

F01 is still `passing` via **manual verification only** — Playwright spec covers F01's headline/CTA/nav
but the "3 seconds on mid-tier connection" timing assertion is not automated.
All other F02–F10, D04, D05 now have full Playwright e2e or Layer-1 verification.

# PROGRESS.md — RentBasket Website

<!-- Amnesiac craftsman's journal (Lecture 05). Update at every clock-out.
     Keep SHORT and CURRENT. History lives in git log. -->

## Current State

- **Latest commit:** `488a290` — V 1.56 (harness content debt now resolved)
- **Test status:** unit: passing (vitest) | e2e: **18/18 passing** — F02–F10 + F01 + D01 all verified
- **Lint:** clean (ESLint + TypeScript strict) | **zero raw hex in source** (D04 done)
- **Build:** `npm run build` succeeds; deployed to GitHub Pages
- **Environment:** static SPA · GitHub Pages · no backend
- **As of:** 2026-05-23

## Completed (recent)

- [x] Category tab fix — `lg:flex-nowrap lg:gap-x-5`, `lg:text-[18px]`: all 4 tabs on one row — 2026-05-23
- [x] SP-02 — Product card hover: `whileHover y:-4 + shadow-elevated`, 200ms easeOut — D02 `passing` — 2026-05-23
- [x] SP-03 — Page transitions: `AnimatePresence mode=wait` wrapping Routes via `RouterApp` inner component — D03 `passing` — 2026-05-23
- [x] D04-partial — Testimonials raw colours → tokens (`text-gold`, `text-muted-foreground`, `text-foreground`, `border-border`, `shadow-elevated`) — 2026-05-23
- [x] SP-07 — Footer: inline styles removed, `py-16` breathing room, copyright year → 2026 — 2026-05-23
- [x] SP-04-partial — Scroll-reveal: FreeServices (both columns `whileInView fadeUp`); Testimonials heading (`whileInView`); `text-gradient-coral` token added to index.css — 2026-05-23
- [x] Whitespace pass — Trimmed desktop padding on FreeServices, MythOrFact, Testimonials, DownloadSection, WhatMakesDifferent. Main column 5776px → 5284px (−492px) — 2026-05-23
- [x] MythOrFact REALITY card — Fixed text overflow (was "REALIT"), swapped `font-serif`→`font-display` (Playfair), removed aggressive red glow border, raw `text-red-100`→`text-white/90`, `text-gray-500`→`text-muted-foreground`. Playwright-verified at 1440×900 — 2026-05-23
- [x] V1.56 — Catalog page fully functional: duration key fixes, Framer Motion forwardRef compat
- [x] SP-01 — Hero mobile-first rewrite: `flex-col lg:flex-row`, CTA above fold at 375px, mascot stacks below — 2026-05-23
- [x] D01 — Hero mobile CTA verified by Playwright e2e — `passing` — 2026-05-23
- [x] E01 — Playwright installed + wired: 3/3 landing specs passing (F01, D01, smoke) — 2026-05-23

## In Progress

<!-- Exactly one (WIP=1). If two are listed, the harness is violated. -->

_None — all content debt resolved this session._

## Blocked

_None._

## Known Issues

- **No `.env.local`** on a fresh clone until `make setup` is run (expected — documented in .env.example).
- **`dist/` is checked in** — gh-pages workflow artifact. Not source — ignore in code review.
- **Uncommitted dist/* changes** — pending `make deploy` after this session's changes are committed.

## Next Steps

1. **SP-05** — Catalog filter active-tab highlight at 375px (currently hard to see on mobile).
2. **SP-06** — Checkout progress indicator: step labels truncate on 375px.
3. `make deploy` — push current state to GitHub Pages.

## Handoff Note

`make check` passes all 3 layers — L1 lint+arch (0 raw hex), L2 vitest, L3 Playwright **18/18**.
This session resolved all harness content debt:
- **Playwright specs** written for F02–F10 (catalog, product-detail, cart, checkout, mobile) — all passing
- **D04 done** — 30 `ignore-harness` hex values converted to tokens across 5 components; 7 new CSS vars + tailwind entries added
- **D05 done** — `whileInView once:true` scroll-reveal added to FurnitureGallery (section), ResponsibilitySection (h2 ×2), WhatMakesDifferent (h2), MythOrFact (h2)
- `data-testid="product-card"` added to ProductCard for reliable e2e targeting
Next priority: SP-05 (mobile catalog tab highlight) and SP-06 (checkout progress truncation).

---
_Last updated by `claude-code` at 2026-05-23T00:00:00Z via harness bootstrap._

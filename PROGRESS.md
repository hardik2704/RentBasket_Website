# PROGRESS.md — RentBasket Website

<!-- Amnesiac craftsman's journal (Lecture 05). Update at every clock-out.
     Keep SHORT and CURRENT. History lives in git log. -->

## Current State

- **Latest commit:** `603ff5fd` (plus UI-changes local branch commits)
- **Test status:** unit: passing (vitest) | e2e: passing (playwright 9/9)
- **Lint:** clean (ESLint + TypeScript strict)
- **Build:** `npm run build` succeeds; deployed to GitHub Pages
- **Environment:** static SPA · GitHub Pages · no backend
- **As of:** 2026-06-15

## Completed (recent)

- [x] UI-Testimonials — Interactive testimonials upgrades with framer-motion (spring-physics card hovers, slow-floating background cards, mascot bobbing), design token alignments, and Playwright spec fixes — 2026-06-15
- [x] Trust & Policy pages — created Terms, Shipping, FAQs, About, Contact pages, wired router and copy-spa-404 config, and verified all 9 tests pass in Playwright — 2026-06-02
- [x] Phase 2 — wired pricing engine (`src/lib/pricing.js`) into cart and checkout UI, resolved surcharges, lifted coupon state, and enriched WhatsApp order handoff — 2026-06-02
- [x] Phase 2 planning and implementation plan refinement — aligned on zero-deposit recommendations, WhatsApp pricing details, and orphaned pages integration — 2026-06-02
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

_None — all planned work for this session completed._

## Blocked

_None._

## Known Issues

- **No `.env.local`** on a fresh clone until `make setup` is run (expected — documented in .env.example).
- **`dist/` is checked in** — gh-pages workflow artifact. Not source — ignore in code review.
- **26 uncommitted dist/* changes** — pending `make deploy` after harness is confirmed green.

## Next Steps

1. **SP-04** (remainder) — Add `whileInView` to remaining unanimated sections: `ResponsibilitySection`, `MythOrFact`, `WhatMakesDifferent` heading.
2. **D04** (remainder) — Audit `MythOrFact.jsx` raw hex (`border-[#ff0000]`, rgba red) — replace with a `--danger` token or `text-destructive`.
3. **SP-05** — Catalog filter active-tab highlight at 375px (currently hard to see on mobile).
4. **SP-06** — Checkout progress indicator: step labels truncate on 375px.
5. `make deploy` — push current state to GitHub Pages after next check passes.

## Handoff Note

Playwright e2e passes 9/9.
This session shipped:
- Upgraded `LovedByCustomers` page section with `framer-motion` spring animations.
- Sibling cards dim to `0.5` opacity on hover while the active card moves to front, scales up `1.04`, translates up `-15px`, and shifts laterally to show obscured text.
- Mascot floats gently with an infinite bobbing animation.
- Background blurred cards float asynchronously at varying durations.
- Aligned cards with style system HSL variables (replacing raw hex values) and formatted text highlights.
- Fixed Playwright baseURL path mismatch and dual-hero h1/cta strict mode selector conflicts.

---
_Last updated by `claude-code` at 2026-06-15T11:45:00Z via harness bootstrap._

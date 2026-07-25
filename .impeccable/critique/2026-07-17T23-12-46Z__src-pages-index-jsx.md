---
target: homepage
total_score: 24
p0_count: 2
p1_count: 2
timestamp: 2026-07-17T23-12-46Z
slug: src-pages-index-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Gallery has a loading skeleton, but nothing else signals loading/freshness; no indication the carousel auto-scrolls/is draggable before you touch it |
| 2 | Match System / Real World | 3 | Real ₹ pricing, real neighborhoods (Gurgaon/Noida) in testimonials; "Delhi NCR" claimed in hero but never geofenced or explained |
| 3 | User Control and Freedom | 2 | Mobile quiz locks `document.body.style.overflow = "hidden"`; only exit is a small top-right X, no Escape key, no swipe-to-dismiss |
| 4 | Consistency and Standards | 2 | Same "myth vs reality" concept labeled 3 different ways ("Belief or Reality?" ×2, "Myth or Reality?"); quiz's "Next Myth" button uses a bespoke black pill matching neither brand button class |
| 5 | Error Prevention | 3 | Quiz answer-lock prevents re-answering; gallery's 3-tier fallback (curated → trending → any product) is genuinely defensive |
| 6 | Recognition Rather Than Recall | 3 | Cart badge always visible, sticky header, URL-param-driven mobile search state survives remount |
| 7 | Flexibility and Efficiency | 2 | No skip-to-content, no keyboard shortcuts; gallery's drag/arrow/auto-scroll is a genuine flexibility win |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained cream/white rhythm and soft shadows; docked for the repeated eyebrow pattern and an unlabeled gallery section |
| 9 | Error Recovery | 2 | No error/empty state anywhere — if `useProducts()` fails, the featured strip silently renders nothing right under the hero |
| 10 | Help and Documentation | 2 | FAQs reachable from nav/footer; no inline reassurance that browsing carries no commitment |
| **Total** | | **24/40** | **Acceptable band — solid bones, several fixable gaps, not a systemic failure** |

*(Two independent design reviews scored this within one point of each other — 23 and 24 — which is a good sign the scoring is stable, not assessor noise.)*

## Anti-Patterns Verdict

**Start here: does this look AI-generated?** Not at a glance. The turtle mascot, soft-shadow system, pill buttons, and real testimonials genuinely land the "premium, warm, editorial" brief. But a careful look — exactly the kind of look the founder's critics gave it — finds the specific, fixable tells your DESIGN.md already predicted.

**LLM assessment (both independent reviewers agreed):**
- **The uppercase tracked eyebrow, reached for twice, independently.** `HeroSection.jsx`'s "Live Flexible" and `MythOrFact.jsx`'s "Belief or Reality?" / "Myth or Reality?" all use the identical `text-xs font-bold tracking-[0.15em] text-primary uppercase` pattern — the literal thing your own DESIGN.md calls a hard-fail AI tell. Two components reaching for it independently is the strongest signal that it's a default, not a choice.
- **The hero stat block (2000+ Happy Customers / 4.9 Google Rating) is a templated hero-metric pattern** — vertical number, tiny uppercase caption, divider — the generic SaaS-landing trope, just skinned in your fonts. Tasteful execution, generic shape.
- **Copy quality is uneven, and the unevenness is the actual tell.** Testimonials, the footer tagline ("Comfort for your home, without the hassle of ownership"), and the Myth/Reality reassurance copy are specific and clearly considered. Sitting right next to them: "Contact Us" (stock nav label), "Browse Products" (generic footer link), and a completely unlabeled `FurnitureGallery` section with no heading at all. One reviewer called this explicitly: *"some copy is clearly considered and some is left at template-default, and that inconsistency is precisely the 'certain texts' feedback."*
- **Footer legal-name mismatch**: "© 2023-2026 IG RentOK Private Limited" appears with no line connecting it to "RentBasket" — reads like an unreconciled legal paste-in to a trust-sensitive visitor doing a final check before handing over a deposit.

**Deterministic scan (Assessment B, `detect.mjs` + runtime injection):**
- CLI scan: 1 finding (`broken-image` in `ProductImage.jsx:9`) — **false positive**, confirmed by reading the component: it only renders a bare `<img>` when `src` is truthy, falling back to a `<Package>` icon placeholder otherwise. The detector's static AST scan can't see that runtime guard.
- Runtime injection (375px viewport): **42 anti-patterns**, most of which cluster into a few real families:
  - `low-contrast` (2×, confirmed by two independent runs): `#ffffff` on `#e54034` at **4.1:1** is a clear, real failure below the 4.5:1 AA minimum — likely white text over a coral background element. The second flag, `#737373` on `#faf8f5` at exactly `4.5:1`, sits right on the boundary and may just be a rounding artifact, not a genuine fail — worth checking but lower urgency than the coral pairing.
  - `skipped-heading` (1×): `<h1>` "Furnish your home, on your own terms." is directly followed by an `<h3>` (a product title) with **no `<h2>` in between** — a real heading-hierarchy break, bad for screen-reader users navigating by heading level.
  - `hero-eyebrow-chip` (2×, one physical element double-counted across two rule variants): independent runtime confirmation of the eyebrow pattern both LLM reviewers flagged from source.
  - `text-overflow` (5×) and `body-text-viewport-edge` (~23×) — **likely false positives**: both reviewers independently traced these to the horizontally-scrolling furniture gallery carousel, where off-screen sibling cards sit thousands of pixels outside the current viewport by design — the arithmetic-progression pattern in the offsets is the signature of measuring carousel clones, not real bleeding text. `truncate`-class product titles showing ellipsis ("Premium Upholstered Qu...") is intentional Tailwind behavior, not overflow. Two of the smaller positive offsets (+16px) are worth a second look since they're near the viewport edge rather than deep off-screen, but the bulk of this family is noise.
  - `nested-cards` (5×), `image-hover-transform` (15×), `layout-transition` (1×) — lower-priority pattern flags, not independently visually verified by either run; likely mostly benign (hover-transform on product images is an intentional micro-interaction here, not an anti-pattern).

**Visual evidence**: Full-page screenshots taken at 1440px and 375px by two independent runs, plus manual scroll-verification at four depths (900/1600/2000/2400px) on mobile. This confirmed, reproducibly (not a single transient animation frame, not a mobile-only quirk): **the `MythOrFact` "Belief or Reality?" section has a large dead-space layout defect on BOTH desktop and mobile.** On desktop (1440×900), the comparison cards are confined to a narrow ~40% column pushed right, leaving a 700-900px-tall blank rectangle occupying the left ~55-60% of that section — the section's own eyebrow and heading get pushed down and stranded at the bottom-left of the empty zone instead of sitting beside the cards. On mobile, the same section shows roughly one full viewport height of empty gap between the accordion section above and the quiz content below. This is not confined to the mobile scroll-jacked quiz mechanism — it's a structural layout bug in the section itself, present regardless of viewport. Also observed: a fixed bottom tab bar visually overlapping the "What makes RentBasket different" heading on mobile, and carousel-edge cropping on both viewports (likely intentional, but worth a glance).

## Overall Impression

This is a well-built page with genuine engineering craft underneath it — the gallery's fallback logic and seamless-loop carousel, the quiz's spring-tuned scroll physics, the specific and real testimonial copy. None of that reads as vibe-coded. What does: a design-system rule your own DESIGN.md states explicitly (no uppercase tracked eyebrows) got violated twice, independently, in different components — which is exactly the fingerprint of reaching for a stock pattern rather than making a considered choice. Combine that with a few sections where the copy pass never landed (unlabeled gallery, generic "Contact Us," the unreconciled footer legal name), and you get precisely the feedback you described: not "this looks bad," but "something about certain texts feels off." The single biggest opportunity is the mobile quiz's dead-space bug — it's a real, reproducible defect that could read as "the site is broken" to a first-time visitor at the exact moment you're trying to build trust.

## What's Working

1. **The gallery's carousel engineering** (`FurnitureGallery.jsx`): true seamless looping via doubled-list + modulo-wrapped transform, unified input handling across auto-scroll/arrow-nudge/drag-swipe, and a three-tier fallback (curated → trending → any product) that keeps the strip full even under data drift. This is the opposite of vibe-coded — considered, tested engineering.
2. **Testimonials are real, not templated**: specific names, specific neighborhoods, specific claims ("delivered within four hours," "used in three different flats"). This is the single best copy on the page and shows what "specific, considered language" looks like right next to sections that don't have it yet.
3. **The Myth/Reality content strategy is substantively strong** — it answers the actual objections a relocating renter would have (lock-in, repairs, hidden costs, quality) with real numbers. The content strategy is right; only the presentation (repeated eyebrow, mobile dead-space bug) needs work.

## Priority Issues

**[P0] The `MythOrFact` "Belief or Reality?" section has a large dead-space layout defect on BOTH desktop and mobile.**
**Why it matters**: Confirmed independently by two separate assessment runs, at multiple scroll depths and both viewport sizes — this is a reproducible structural bug, not a rendering glitch or a mobile-only quirk of the scroll-jacked quiz. On desktop, the comparison cards are pushed into a narrow right column, leaving a 700-900px blank rectangle with the section's own heading stranded at the bottom of the empty space. On mobile, a full viewport height of blank gap separates the accordion section above from the quiz content below. A visitor at either screen size hits this exact section — the one doing your most important objection-handling work — and it looks broken, right at the point you're trying to earn trust for a new-city furniture decision.
**Fix**: Investigate the `MythOrFact.jsx` layout/grid structure directly — likely a flex/grid sizing issue where a container is set to expand (perhaps for the mobile scroll-morph mechanism) but its content isn't filling or centering within that expanded space at rest, on both breakpoints. This is a layout-structure fix, not a copy or visual-polish one.
**Suggested command**: `/impeccable polish` (scoped to `MythOrFact.jsx` specifically)

**[P0] The uppercase tracked eyebrow pattern violates your own DESIGN.md rule, independently, in two components.**
**Why it matters**: "Live Flexible" (hero) and "Belief or Reality?"/"Myth or Reality?" (×3 across MythOrFact) all use the identical forbidden pattern. This is the single clearest, most fixable "vibe-coded" fingerprint on the page — confirmed by two independent design reviews and the runtime detector.
**Fix**: Remove the eyebrow treatment from the hero, or fold "Live Flexible" into the headline itself. Consolidate the three different Myth/Reality labels into one consistent phrase used once, not restyled as a floating eyebrow chip.
**Suggested command**: `/impeccable clarify` (copy consolidation) then `/impeccable typeset` or `/impeccable polish` for the visual treatment

**[P1] `FurnitureGallery` has no heading at all.**
**Why it matters**: It's the very first content under the hero and currently has zero textual introduction — no "Featured," no "Trending now," nothing. Both reviewers independently called this out as reading like an unfinished section rather than a deliberate minimalist choice, since nothing else on the page omits a heading.
**Fix**: Add one short, specific heading tied to real brand facts — e.g., something referencing the actual service areas from your testimonials (Gurgaon/Noida) rather than a generic "Featured Products."
**Suggested command**: `/impeccable clarify`

**[P1] Real, measured contrast failure: white text on coral background at 4.1:1.**
**Why it matters**: Below the WCAG AA 4.5:1 minimum you've committed to in PRODUCT.md's accessibility baseline. This is a deterministic, measured finding, not a subjective call.
**Fix**: Darken the coral background slightly or use a different text treatment at that specific location (likely a coral CTA button or badge — needs a quick visual confirmation to pinpoint exactly which element).
**Suggested command**: `/impeccable audit` (to confirm and catalog every instance) then `/impeccable polish`

**[P2] Heading hierarchy skips a level: `<h1>` straight to `<h3>`.**
**Why it matters**: A real accessibility regression for screen-reader users who navigate by heading level — they'll perceive a broken document outline. Likely caused by the unlabeled `FurnitureGallery` section (no `<h2>` because there's no heading at all there), so this may resolve automatically once P1's gallery heading is added — but should be confirmed, not assumed.
**Fix**: Add the missing `<h2>` (likely the same fix as the gallery heading above); audit the rest of the page for any other skipped levels.
**Suggested command**: `/impeccable audit`

**[P2] Mobile scroll-lock quiz has no keyboard or gesture escape.**
**Why it matters**: `document.body.style.overflow = "hidden"` traps scroll with only a small top-right X as the exit. A distracted mobile user who didn't mean to engage (Casey persona) or a user testing recoverability (Riley persona) will read this as a trap, directly conflicting with the "comfort, care" brand promise.
**Fix**: Add an Escape-key listener and treat a deliberate downward swipe/scroll-attempt within the overlay as an implicit dismiss.
**Suggested command**: `/impeccable harden`

**[P2] Generic nav CTA copy: "Contact Us."**
**Why it matters**: Every other piece of copy on this page (testimonials, footer tagline, Myth/Reality content) is specific and considered; this stock label sits in the single most persistent, most visible chrome element on every page.
**Fix**: Replace with something in brand voice — e.g., "Talk to Us" or "Ask a Question."
**Suggested command**: `/impeccable clarify`

**[P3] Footer legal-name mismatch with no context.**
**Why it matters**: "IG RentOK Private Limited" appears with zero connective tissue to "RentBasket" — a trust-sensitive visitor doing a final check before a deposit-based commitment may read this as a red flag rather than routine boilerplate.
**Fix**: Add one clarifying line, e.g., "RentBasket is a brand of IG RentOK Private Limited," near the copyright line.
**Suggested command**: `/impeccable clarify`

## Persona Red Flags

**Jordan (confused first-timer)**: Reads the hero clearly enough, but the mobile hero has **no explanatory subhead at all** — the sentence explaining "this is furniture rental" only exists in the desktop version. Jordan on mobile (the likely majority device) never sees it, and has to infer the business model from product cards and prices alone. Then scrolls past the unlabeled `FurnitureGallery` with no idea why these specific products are shown first, and — if scrolling at a normal pace — very plausibly lands on the quiz's dead-space bug and may conclude the site is broken.

**Casey (distracted mobile user)**: Scrolls quickly, hits the quiz's fullscreen scroll-lock mid-distraction. Because Casey wasn't reading closely, the sudden takeover — with body scroll locked and only a small 36px top-right X to escape — reads like an ad interstitial or a bug, not a considered feature. A distracted user under time pressure is exactly the persona least likely to notice a small corner control.

**Riley (deliberate stress tester)**: Tabs through the header via keyboard — focus rings are present and correct, a genuine pass. Finds the footer's legal-name mismatch immediately and reads it as a trust flag before a deposit-based commitment. Also notices the quiz has no way to revisit a previous answer and no back button — a deliberate one-way lock that, combined with no escape hatch, reads as untested for recoverability.

## Minor Observations

- Footer's "Quick Links" list has 6 ungrouped items, exceeding the ≤4 chunking guideline — consider splitting into Shop vs. Company/Legal groups.
- `Header.jsx`'s "Contact Us" button is `hidden lg:inline-flex` — disappears entirely below desktop width, so tablet/mobile users have no persistent contact affordance in the header at all, inconsistent with desktop.
- The quiz's comparison-results table uses `text-[9px]` headers on a 375px screen — borderline readable for an already information-dense table.
- Testimonials data hardcodes only Gurgaon/Noida, while the hero claims "Delhi NCR" broadly — a first-timer from elsewhere in NCR sees zero social proof from their area.
- The `WhatMakesDifferent` section's `font-script` treatment on the word "different" is a genuinely nice, restrained use of your accent font — worth extending consistently elsewhere rather than leaving as a one-off.
- A Chromium-specific console error appeared on reload: `net::ERR_CACHE_OPERATION_NOT_SUPPORTED` on `ku_looping.webm` (the mascot video) — worth a quick check, likely a caching quirk rather than a real bug.

## Questions to Consider

- If three people independently told you specific "texts" feel vibe-coded, would a 10-minute conversation asking them to point at the exact phrases resolve this faster than another design pass?
- The Myth/Reality content is doing your most important trust-building work substantively, but gets the least distinct visual treatment (styled like a generic FAQ accordion) while the least substantive section (the hero stat block) gets the most bespoke treatment — should that investment be inverted?
- The turtle mascot is your single most differentiated, least-generic asset, and it appears once, in the hero. What would change if it reappeared at the page's actual highest-anxiety moment — near the deposit/trust question — instead of only as hero decoration?

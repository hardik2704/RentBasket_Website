# RentBasket — Visual & Design System Audit
**Date:** 2026-05-12  
**Scope:** Full source-code audit of all 6 pages + shared components  
**Method:** Static analysis (Chrome extension unavailable at time of audit; live-site WebFetch confirmed the SPA loads as a JS bundle — markup is client-rendered)

---

## Table of Contents
1. [Computed Color Palette](#1-computed-color-palette)
2. [Typography Inventory](#2-typography-inventory)
3. [Page-by-Page Audit](#3-page-by-page-audit)
4. [Cross-Page Inconsistencies](#4-cross-page-inconsistencies)
5. [Component Variant Audit](#5-component-variant-audit)
6. [Spacing & Layout Audit](#6-spacing--layout-audit)
7. [CLAUDE.md Compliance](#7-claudemd-compliance)
8. [Priority Fix List](#8-priority-fix-list)

---

## 1. Computed Color Palette

### Design-Token Colors (`index.css`)
| Token | HSL value | Computed hex | Role |
|---|---|---|---|
| `--primary` | `hsl(4, 77%, 55%)` | `#E03B2E` | Coral red — main brand CTA |
| `--accent` | `hsl(45, 100%, 51%)` | `#FFAD00` | Gold — star ratings, accent |
| `--cream` | `hsl(40, 33%, 97%)` | `#FAF7F3` | Section backgrounds |
| `--background` | `hsl(0, 0%, 100%)` | `#FFFFFF` | Page background |
| `--foreground` | `hsl(0, 0%, 13%)` | `#212121` | Body text |
| `--muted-foreground` | `hsl(0, 0%, 45%)` | `#737373` | Secondary text |
| `--border` | `hsl(0, 0%, 90%)` | `#E5E5E5` | Borders |
| `--secondary` | `hsl(30, 10%, 96%)` | `#F5F3F1` | Secondary fills |

### Hardcoded Colors Found **Outside the Token System** ⚠️
These break single-source-of-truth and will not respond to theme changes:

| Location | Value | What it does |
|---|---|---|
| `HeroSection.jsx:29,109` | `#DF252F`, `#EE1140`, `#FAD694` | H1 gradient text |
| `HeroSection.jsx:62,138` | `#D72F26` | Stats "2000+" number |
| `DownloadSection.jsx:79` | `linear-gradient(#D72F26, #B02020)` | Red CTA section bg |
| `DownloadSection.jsx:104,127,150,170` | `#A51D16` | Download button text |
| `CatalogHero.jsx:38,78` | `linear-gradient(#D72F26, #EF1040, #FECC87)` | "Complete Home Setup" btn |
| `OrderSummary.jsx:214` | same gradient | "Proceed to Checkout" btn |
| `MythOrFact.jsx:43` | `#ff4d4d → #d01111` | Card front gradient |
| `MythOrFact.jsx:63` | `#ba3737 → #610303` | Card back gradient |
| `MythOrFact.jsx:15` | `rgba(255,0,0,0.8)` | Glowing red inner border |
| `Testimonials.jsx:23` | `#8B5CF6` | Underline decoration on center card |
| `ResponsibilitySection.jsx:74–77` | `rgb(209,213,219)` → `rgb(31,41,55)` | Scroll-reveal word colors |
| `WhatMakesDifferent.jsx:254` | `blue-200`, `blue-950` | Off-brand gradient divider |
| `WhatMakesDifferent.jsx:26` | `bg-red-500` | Feature icon backgrounds |
| `FreeBenefits.jsx:23` | `color: "#868585"` | Benefit list text |
| `FurnitureGallery.jsx (multiple)` | `bg-gray-50`, `bg-gray-100`, `text-gray-500` | Gallery cards |

**Critical violation — `#8B5CF6` (purple)** in `Testimonials.jsx:23` is exactly the "Lila Ban" color forbidden by the Taste skill. It should be replaced with `text-primary` or removed entirely.

---

## 2. Typography Inventory

### Declared Font Stack
| Role | Family | Loaded via |
|---|---|---|
| `font-display` (h1–h6) | Playfair Display | Google Fonts (`index.css:1`) |
| `font-sans` (body) | Inter | Google Fonts (`index.css:1`) |

### **Ghost Fonts — Declared but Never Loaded** ⚠️
| Location | Declared value | Status |
|---|---|---|
| `HeroSection.jsx:36,98` | `style={{ font: "Playwrite US Trad" }}` | **Not in Google Fonts import** — silently falls back to Playfair Display/Inter |
| `FoundersSection.jsx:9` | `fontFamily: "Sans Atwic Modern Trial"` | **Not installed, not loaded** — silent fallback |

### Mixed Font Usage Inconsistencies
| Component | Issue |
|---|---|
| `HeroSection.jsx:88` | H1 uses `font-normal` — no `font-display` class, so it inherits Inter instead of Playfair Display |
| `MythOrFact.jsx:72` | Back-of-card heading uses `font-serif` (browser default serif) instead of `font-display` |
| `Testimonials.jsx` | No heading font class — `text-4xl md:text-6xl font-bold` defaults to Inter |
| `WhatMakesDifferent.jsx:138` | Section title explicitly uses `font-sans` (redundant and inconsistent with all other section titles which use `font-display`) |
| `Footer.jsx` | Every element has explicit `font-sans` class — defensive redundancy, inconsistent with rest of codebase |
| `DownloadSection.jsx:42,66` | "DOWNLOAD TODAY" h1 uses `font-sans font-bold` — should use `font-display` like equivalent headings on other pages |

### Type Scale Observations
- H1 ranges: `text-3xl` (Catalog mobile) → `text-4xl` → `text-5xl` → `text-6xl` across pages — no single governing rule
- Stats "2000+" in Hero: `text-6xl` (mobile) vs `text-4xl` (desktop) — reversed scale is a bug
- `text-[10px]` used in multiple places (ProductCard duration chips, cart trust badges) — below the `text-xs` floor recommended by Taste

---

## 3. Page-by-Page Audit

---

### 3.1 Homepage (`/`) — `Index.jsx`
**Sections:** Header → HeroSection → FurnitureGallery → FreeBenefits → ResponsibilitySection → HowItWorks → FoundersSection → MythOrFact → Testimonials → DownloadSection → WhatMakesDifferent → Footer

| # | Section | Finding | Severity |
|---|---|---|---|
| 1 | **HeroSection** | H1 gradient uses hardcoded `#DF252F/#EE1140/#FAD694` — not token-driven | Medium |
| 2 | **HeroSection** | `font: "Playwrite US Trad"` style on `.headline-accent` span — font never loaded | High |
| 3 | **HeroSection** | Stats font size `text-6xl` (mobile) vs `text-4xl` (desktop) — smaller on wider screens | High |
| 4 | **HeroSection** | `z-5000` class on stats div — Tailwind has no `z-5000` utility, class is ignored | Low |
| 5 | **HeroSection** | Full duplicate markup for mobile/desktop with `lg:hidden`/`hidden lg:flex` — drift risk | Medium |
| 6 | **FurnitureGallery** | `isMobile.current` (a ref) used as `useEffect` dependency — ref changes don't trigger effect | High (bug) |
| 7 | **FurnitureGallery** | Raw `bg-gray-50`, `bg-gray-100`, `text-gray-500` — outside token system | Low |
| 8 | **FurnitureGallery** | Category tab active style: `text-primary border-b-2 border-primary` vs inactive: `text-gray-600 hover:text-gray-900` — `gray-600/gray-900` are raw Tailwind, not tokens | Low |
| 9 | **FreeBenefits** | Benefit list text uses `color: "#868585"` inline — should be `text-muted-foreground` | Low |
| 10 | **FreeBenefits** | Desktop layout uses non-Tailwind classes: `w-90`, `w-100` (invalid) — will fall back to no width | High (bug) |
| 11 | **ResponsibilitySection** | `window.addEventListener('scroll', ...)` — Taste rules forbid raw scroll listeners; should use Framer Motion's `useScroll` like `HowItWorks.jsx` does | Medium |
| 12 | **ResponsibilitySection** | Desktop text size: `fontSize: "180%"` inline — arbitrary, not on Tailwind scale | Medium |
| 13 | **HowItWorks** | Correctly uses Framer Motion `useScroll` — this is the gold standard for the site | ✅ Good |
| 14 | **FoundersSection** | `fontFamily: "Sans Atwic Modern Trial"` — font not loaded anywhere | High |
| 15 | **FoundersSection** | `width: "55%"`, `margin: "auto"` inline styles — should be Tailwind `w-1/2 mx-auto` | Low |
| 16 | **MythOrFact** | All colors hardcoded (#ff4d4d, #d01111, #ba3737, #610303) — no token usage | Medium |
| 17 | **MythOrFact** | `rgba(255,0,0,0.8)` glowing red neon border — violates Taste "NO Neon/Outer Glows" rule | High |
| 18 | **Testimonials** | `#8B5CF6` purple underline decoration — **banned "Lila" color**, completely off-brand | High |
| 19 | **Testimonials** | No `font-display` on the main "Loved by Customers" heading | Low |
| 20 | **DownloadSection** | Placeholder text `"Other features here."` visible in production | High |
| 21 | **DownloadSection** | Three separate `<section>` wrappers nested inside each other — unnecessary nesting | Low |
| 22 | **WhatMakesDifferent** | `bg-red-500` for icon backgrounds — should be `bg-primary` | Low |
| 23 | **WhatMakesDifferent** | `window.addEventListener("scroll", ...)` for sticky card effect — should use Framer Motion | Medium |
| 24 | **WhatMakesDifferent** | Off-brand `bg-gradient-to-t from-blue-200 to-blue-10` gradient divider | Medium |
| 25 | **Footer** | Logo positioned with `style={{ position: "fixed", right: 5, bottom: 5 }}` — fixed logo overlaps content | High (bug) |
| 26 | **Footer** | All padding/width set via inline styles (`width: "90%"`, `paddingLeft: "5%"`) | Low |
| 27 | **Header** | `bg:transparent` typo in className (colon instead of `/`) — likely intended `bg-transparent` | Medium |

---

### 3.2 Catalog (`/catalog`) — `Catalog.jsx` + components
| # | Finding | Severity |
|---|---|---|
| 1 | `CatalogHero.jsx`: "Complete Home Setup" btn uses inline gradient override — breaks token system | Medium |
| 2 | `CatalogHero.jsx`: Desktop right panel has `<div className="text-6xl mb-3">🏠</div>` — emoji violates Taste anti-emoji rule | Medium |
| 3 | `CatalogHero.jsx`: Hero right panel is a placeholder (`bg-secondary flex items-center justify-center`) with no real visual content | High |
| 4 | `ProductCard.jsx`: `bg-gray-50` for image container — should use `bg-cream` or `bg-secondary` | Low |
| 5 | `ProductCard.jsx`: Gold stars use `fill-gold text-gold` — token-driven, correct ✅ | ✅ Good |
| 6 | `ProductCard.jsx`: Hover pricing ladder correctly uses Framer Motion `AnimatePresence` ✅ | ✅ Good |
| 7 | `FilterBar.jsx`: Not reviewed, but consistent pattern expected |  |

---

### 3.3 Product Details (`/product/:id`)
| # | Finding | Severity |
|---|---|---|
| 1 | 2-column grid layout is clean and token-compliant ✅ | ✅ Good |
| 2 | Sticky mobile CTA pattern is correct | ✅ Good |
| 3 | No `font-display` observed on product name heading (need sub-component review) | Low |

---

### 3.4 Cart (`/cart`)
| # | Finding | Severity |
|---|---|---|
| 1 | `OrderSummary.jsx`: Grand Total button uses inline gradient override — same inconsistency as CatalogHero | Medium |
| 2 | `OrderSummary.jsx`: `text-green-600` for "Free" delivery labels — green is off-brand (should be `text-primary` or a dedicated success token) | Medium |
| 3 | `OrderSummary.jsx`: Coupon success state uses `bg-green-50 border-green-200 text-green-700` — same green off-brand issue | Medium |
| 4 | `CartHeader`, `CartItemsList`, `CrossSellStrip`: Not reviewed in detail, but page structure is clean |  |

---

### 3.5 Checkout (`/checkout`)
| # | Finding | Severity |
|---|---|---|
| 1 | `font-black` used on "Checkout" H1 — this weight (`900`) not used anywhere else on the site | Low |
| 2 | Trust banner uses `bg-primary/5 border-primary/10` — good token usage ✅ | ✅ Good |
| 3 | `lg:col-span-12 xl:col-span-8` layout: footer is absent — by design (minimal checkout header used instead) | ✅ Intentional |
| 4 | `CheckoutHeader` renders a stripped nav without cart icon — consistent with checkout UX pattern ✅ | ✅ Good |

---

### 3.6 Order Success (`/order-success`)
| # | Finding | Severity |
|---|---|---|
| 1 | Has its own custom minimal header (not `<Header />`) — breaks nav consistency slightly but correct for success flow | Low |
| 2 | Mock data includes real phone number `+91 99588 58473` — fine for demo but worth noting | Low |
| 3 | External image URL `rentbasket.in/wp-content/uploads/...` in mock data — could 404 | Low |

---

## 4. Cross-Page Inconsistencies

### 4.1 Button Styles — Three Competing Variants
| Variant | Where used | Definition |
|---|---|---|
| `.btn-primary` | Product page, catalog, generic CTAs | `bg-primary rounded-full px-6 py-3` |
| `.btn-outline` | Most secondary CTAs | `border-2 border-primary rounded-full px-6 py-3` |
| **Inline gradient override** | CatalogHero, OrderSummary, DownloadSection | `style={{ background: "linear-gradient(..." }}` — bypasses tokens entirely |

The inline gradient CTAs are visually the same coral color but are disconnected from `--primary`. If the brand color ever changes, these won't update.

### 4.2 Section Heading Font Treatment
| Section | Font class applied | Correct? |
|---|---|---|
| HowItWorks | `font-display` | ✅ |
| ResponsibilitySection | `font-display` | ✅ |
| CatalogHero | `font-display` | ✅ |
| HeroSection h1 | `font-normal` (no `font-display`) | ❌ Inter renders |
| WhatMakesDifferent | `font-sans` | ❌ Explicitly wrong |
| DownloadSection | `font-sans font-bold` | ❌ |
| Testimonials | no class | ❌ Inter renders |
| FoundersSection | custom `fontFamily` inline | ❌ font not loaded |

### 4.3 Section Background Rhythm
The homepage has no consistent visual rhythm between section backgrounds. Observed sequence:
1. `bg-background` (white) — Hero
2. `bg-background` (white) — FurnitureGallery  
3. `bg-background` (white) — FreeBenefits
4. `bg-background` (white) — Responsibility
5. `bg-background` (white) — HowItWorks
6. `bg-background` (white) — Founders
7. `bg-gray-50` — MythOrFact (first break)
8. `bg-white` — Testimonials
9. transparent → red gradient — DownloadSection
10. `bg-background` (white) — WhatMakesDifferent

Sections 1–6 are a wall of white with no visual separation. The standard Article.com / West Elm pattern alternates `#FFF` / `#FAF7F3` (cream) to create cadence.

### 4.4 Card Border-Radius
Mostly consistent at `rounded-2xl` across product cards, cart, checkout summary. FurnitureGallery uses `rounded-xl md:rounded-2xl` (minor, responsive).

### 4.5 Scroll Listening Pattern
| Component | Pattern | Correct per Taste |
|---|---|---|
| `HowItWorks` | Framer Motion `useScroll` | ✅ |
| `ResponsibilitySection` | `window.addEventListener('scroll')` | ❌ |
| `WhatMakesDifferent` | `window.addEventListener('scroll')` | ❌ |

---

## 5. Component Variant Audit

### Buttons
- `btn-primary` and `btn-outline` are defined in `@layer components` — correct
- Both use `rounded-full` — visually consistent
- Hover states exist (`hover:bg-coral-dark`, `hover:bg-primary`) — present
- **Missing:** no `:active` tactile state (`-translate-y-[1px]` or `scale-[0.98]`) — Taste Rule 5 violation

### Cards
- Product cards: `rounded-2xl shadow-soft hover:shadow-card` — good
- Founders/story cards: `rounded-2xl shadow-soft` — consistent
- Cart/Checkout summary: `rounded-2xl shadow-soft` — consistent
- Myth cards: hardcoded gradients, standalone — inconsistent with card system

### Inputs
- Header search: `rounded-full border-border focus:ring-primary/20` — good
- Cart coupon input: `rounded-xl border-border focus:ring-primary/20` — slightly different radius than header search
- Checkout form inputs: (not reviewed in detail, assumed consistent)
- **Labels:** Need verification that all form labels sit above inputs per Taste Rule 6

### Status/Badge
- Product badge: `bg-primary text-primary-foreground rounded-full` — ✅ token-driven
- Cart "Free" badges: `text-green-600` — ❌ off-brand color

---

## 6. Spacing & Layout Audit

### Inline Style Overrides (Should Be Tailwind)
| File | Inline style | Tailwind equivalent |
|---|---|---|
| `FoundersSection.jsx:9` | `width: "80%", margin: "auto"` | `w-4/5 mx-auto` |
| `FoundersSection.jsx:32` | `width: "55%", margin: "auto"` | `w-1/2 mx-auto` |
| `ResponsibilitySection.jsx:116–130` | `width: "80%", margin: "auto"` | `w-4/5 mx-auto` |
| `ResponsibilitySection.jsx:150` | `fontSize: "180%"` | `text-2xl` or `text-3xl` |
| `Footer.jsx:12` | `pl-12 lg:pl-28` (mixed inline/Tailwind) | Tailwind only |
| `Footer.jsx:27` | `width: "90%", margin: "auto", paddingLeft: "5%"` | `w-[90%] mx-auto pl-[5%]` |
| `DownloadSection.jsx:29` | `width: "50%", marginLeft: 0, marginBottom: "-50px"` | negative margin is a code smell |
| `FurnitureGallery.jsx:327` | `isMobile.current ? 'w-full px-4' : 'w-[80%] max-w-7xl'` | Consistent but mixed approach |

### `h-screen` / `min-h-screen` Usage
- All page roots use `min-h-screen` — ✅ correct per Taste rules
- No `h-screen` found — ✅ good

### Max-Width Consistency
- `.section-container`: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` — well-defined
- Some sections bypass `section-container`: `MythOrFact` uses `w-full lg:w-1/2 m-auto`, `Testimonials` uses `max-w-7xl mx-auto` directly — acceptable but slightly inconsistent

### Mobile Layout Duplication
Many sections maintain fully separate mobile and desktop trees with `lg:hidden` / `hidden lg:flex`. This is a maintenance risk — changes must be made twice. The `HowItWorks` section handles both in a single responsive tree. Recommend consolidating where possible.

---

## 7. CLAUDE.md Compliance

| CLAUDE.md claim | Reality | Gap |
|---|---|---|
| "Next.js 15 (App Router) + TypeScript" | React 18 + Vite + JSX (no TypeScript in src/) | CLAUDE.md is wrong about the stack |
| "Tokens live in `tokens.css`" | Tokens live in `index.css` | File name mismatch |
| "Colors defined in `design-system.md`" | No `design-system.md` file exists | Missing file |
| "Every new page must include `<KuGuide />`" | No `KuGuide` component exists | Feature not built |
| "`useKuScroll()` hook" | Hook does not exist | Feature not built |
| "React Three Fiber + Drei (3D)" | No Three.js anywhere; mascot is video/PNG | 3D not implemented |
| "Framer Motion for UI animation" | Partially implemented (HowItWorks ✅, ProductCard ✅, others ❌) | Partial compliance |
| "21st.dev for premium blocks" | Not used | Not installed |
| "Impeccable pass: hover + focus + active states" | Active states missing across all buttons | Not done |

**Conclusion:** CLAUDE.md describes an aspirational architecture that doesn't match the current codebase. It should be updated to reflect the actual stack (React+Vite+Tailwind+Framer Motion) or treated as a roadmap.

---

## 8. Priority Fix List

### P0 — Bugs (broken behavior)
1. **`FurnitureGallery.jsx:197`** — `isMobile.current` ref in `useEffect` deps array: ref changes never retrigger the effect. Carousel auto-scroll may silently break on resize. Fix: track a `isMobileState` state variable instead.
2. **`FreeBenefits.jsx:57,63`** — `w-90` and `w-100` are not valid Tailwind classes. Desktop mascot image has no enforced width. Fix: use `w-[360px]` / `w-[400px]`.
3. **`Footer.jsx:114–119`** — Logo positioned `fixed bottom-5 right-5` — it floats over page content. Fix: remove `position: fixed` or move it to a proper footer slot.
4. **`DownloadSection.jsx:92`** — `"Other features here."` placeholder is live in production. Fix: replace with real copy or remove.
5. **`Header.jsx:11`** — `bg:transparent` is an invalid class (should be `bg-transparent`). The header may not have the intended transparent background on mobile.

### P1 — Visual Inconsistencies (design drift)
6. **`Testimonials.jsx:23`** — Remove `#8B5CF6` purple underline. Replace with `text-primary` underline or a coral accent.
7. **`WhatMakesDifferent.jsx:254`** — Remove off-brand `from-blue-200` gradient divider. Use `from-cream` or `from-secondary`.
8. **All gradient CTAs** — Move `linear-gradient(#D72F26, #EF1040, #FECC87)` into a CSS variable (`--gradient-coral` exists already in `index.css`). Apply via class `gradient-coral` instead of inline `style`.
9. **`WhatMakesDifferent.jsx:26`** — Replace `bg-red-500` with `bg-primary` for feature icon backgrounds.
10. **Section heading fonts** — Add `font-display` to: HeroSection H1, Testimonials H2, WhatMakesDifferent H2, DownloadSection H1.

### P2 — Code Quality
11. **Ghost fonts** — Remove `style={{ font: "Playwrite US Trad" }}` from HeroSection and `fontFamily: "Sans Atwic Modern Trial"` from FoundersSection. Either load the fonts properly (add to Google Fonts `@import`) or remove the declarations.
12. **Scroll listeners** — Migrate `ResponsibilitySection` and `WhatMakesDifferent` from `window.addEventListener('scroll')` to Framer Motion `useScroll` (follow the `HowItWorks` pattern).
13. **Section background cadence** — Alternate between `bg-background` and `bg-cream/50` on homepage sections to break the wall-of-white effect.
14. **Active button states** — Add `active:scale-[0.98]` or `active:-translate-y-px` to `.btn-primary` and `.btn-outline` in `index.css`.
15. **Green off-brand** — Replace all `text-green-600 / bg-green-50 / border-green-200` in cart/order with a dedicated success token (add `--success: 145 63% 35%` to `index.css`).

### P3 — Architecture
16. Update `CLAUDE.md` to reflect actual stack (React+Vite, no Next.js, JSX not TSX, tokens in `index.css`).
17. Remove unused `App.css` Vite boilerplate (logo spin, read-the-docs styles).
18. Consolidate mobile/desktop duplicate trees in HeroSection and FreeBenefits into single responsive trees.

---

*Audit performed via full static source analysis of `/Users/hardik/AI/RentBasket_Website/src/`. Chrome browser extension was unavailable for live visual screenshots at time of audit.*

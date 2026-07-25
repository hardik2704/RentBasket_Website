---
name: RentBasket
description: Furniture rental for young professionals relocating between cities — comfort, care, conserve.
colors:
  coral: "hsl(4, 77%, 55%)"
  coral-light: "hsl(4, 77%, 65%)"
  coral-dark: "hsl(4, 77%, 45%)"
  gold: "hsl(45, 100%, 51%)"
  gold-light: "hsl(45, 100%, 70%)"
  cream: "hsl(40, 33%, 97%)"
  ink: "hsl(0, 0%, 13%)"
  gray-text: "hsl(0, 0%, 45%)"
  background: "hsl(0, 0%, 100%)"
  border: "hsl(0, 0%, 90%)"
  success: "hsl(145, 63%, 35%)"
  success-muted: "hsl(145, 35%, 96%)"
  destructive: "hsl(0, 84%, 60%)"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontWeight: 700
    lineHeight: 1.1
  script:
    fontFamily: "Playwrite US Trad Variable, Playfair Display, cursive"
    fontWeight: 400
  body:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "calc(0.75rem - 4px)"
  md: "calc(0.75rem - 2px)"
  lg: "0.75rem"
  pill: "9999px"
spacing:
  container-padding: "1rem"
  container-padding-lg: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.background}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.coral-dark}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.coral}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-gradient:
    textColor: "{colors.background}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
---

# Design System: RentBasket

## 1. Overview

**Creative North Star: "The Considerate Sublet"**

RentBasket furnishes a home you might not stay in forever, and the design has to earn that trust in one sitting: warm enough to feel like a real home outfitter (Article.com, West Elm), restrained enough to feel like a well-run product (Linear, Vercel), never like a discount big-box retailer or a templated SaaS trial page. The coral-to-gold warmth carries the "comfort, care" half of the brand; the restraint — flat surfaces, soft ambient shadows instead of hard drop shadows, generous whitespace — carries the "conserve" half. A turtle mascot recurs across marketing sections as the one deliberately playful, unhurried note in an otherwise clean system.

This system explicitly rejects: gradient text used decoratively, tiny uppercase tracked eyebrows above every section, numbered section scaffolding (01/02/03) where the content isn't actually sequential, identical repeating card grids, side-stripe colored borders, and glassmorphism used as a default rather than a rare, purposeful effect. More broadly, it rejects anything that reads as templated or "vibe-coded" — the standing critique on this project is that specific copy choices and component defaults occasionally break the otherwise well-regarded visual craft, so drift toward generic AI-pattern defaults is a first-order failure here, not a stylistic nitpick.

**Key Characteristics:**
- Warm coral/gold brand gradient reserved for hero moments and primary CTAs, not scattered everywhere
- Soft, ambient shadow language (never hard drop shadows) — depth reads as lift, not weight
- Serif display (Playfair Display) for headlines paired with a clean humanist sans (Inter) for everything functional
- Fully pill-shaped buttons (`rounded-full`) as the signature interactive shape across marketing surfaces
- HSL CSS custom properties as the single source of truth for color — no raw hex in JSX

## 2. Colors

The palette is Committed, not Restrained: one warm coral anchors identity and carries roughly a third of any hero or CTA moment, set against a near-white neutral base and a single gold accent used sparingly for contrast and warmth in gradients.

### Primary
- **Coral** (`hsl(4, 77%, 55%)`): the brand's signature color. Primary buttons, links, focus rings, active states, the `headline-accent` italic word treatment on hero copy.
- **Coral Dark** (`hsl(4, 77%, 45%)`): hover state for coral-filled buttons.
- **Coral Light** (`hsl(4, 77%, 65%)`): lighter tints for secondary emphasis and gradient stops.

### Secondary
- **Gold** (`hsl(45, 100%, 51%)`): the second gradient stop in `--gradient-coral` / `--gradient-hero`. Used for warmth and shimmer at the edge of hero gradients, rarely as a solid fill on its own.

### Neutral
- **Cream** (`hsl(40, 33%, 97%)`): warm off-white section backgrounds, alternating with pure white to create rhythm between sections without a hard visual break.
- **Ink** (`hsl(0, 0%, 13%)`): primary text color and dark-mode background base.
- **Gray Text** (`hsl(0, 0%, 45%)`): secondary/muted copy — body text on light backgrounds should still verify ≥4.5:1 contrast against cream, not just white.
- **Border** (`hsl(0, 0%, 90%)`): hairline dividers and input borders.

### Semantic
- **Success** (`hsl(145, 63%, 35%)`) with a dedicated `success-muted` background (`hsl(145, 35%, 96%)`): used specifically in cart/checkout flows in place of a generic Tailwind green, per an explicit project decision.
- **Destructive** (`hsl(0, 84%, 60%)`): errors, delete confirmations, out-of-stock messaging.

### Named Rules
**The Reserved Gradient Rule.** The coral→red→gold gradients (`--gradient-coral`, `--gradient-hero`) are hero-and-CTA-only. They do not appear as decorative backgrounds behind arbitrary content, and gradient *text* (`background-clip: text`) is never used for emphasis — the codebase's own `.gradient-hero-text` utility exists but should be treated as legacy risk, not a pattern to extend; new work should not add more gradient-text usage.

## 3. Typography

**Display Font:** Playfair Display (with Georgia, serif fallback)
**Body Font:** Inter Variable (with system-ui, sans-serif fallback)
**Script/Accent Font:** Playwrite US Trad Variable (with Playfair Display, cursive fallback) — used sparingly for a handwritten accent note, not for body or headline copy

**Character:** A confident editorial serif against a quiet, functional sans — the same contrast pairing as West Elm or Article's own marketing sites, not two similar grotesques that blur together.

### Hierarchy
- **Display** (700, `clamp()`-scaled up to ~6rem ceiling, 1.1 line-height): hero headlines only. Every `h1`–`h6` in the codebase inherits `font-display` globally — verify long headline copy doesn't overflow at tablet widths.
- **Headline** (700, section-level serif): section titles, card feature titles.
- **Title** (500–600, Inter): sub-headings, card titles inside product/catalog components.
- **Body** (400, Inter, 1.6 line-height): all paragraph copy. Cap measure at 65–75ch; verify actual rendered contrast against `cream`, not just against white.
- **Label** (500, Inter, small size): form labels, badges, button text.

### Named Rules
**The One-Voice Italic Rule.** `.headline-accent` (italic Playfair Display in coral) is the single reserved way to emphasize one word inside a serif headline. It is not a general-purpose emphasis tool — don't apply it to more than one phrase per headline.

## 4. Elevation

Flat by default, lifted only on interaction or explicit card contexts. There are no hard, high-contrast drop shadows anywhere in the system — every shadow is soft, diffuse, and low-opacity, meant to read as gentle lift rather than a hard-edged object sitting on the page.

### Shadow Vocabulary
- **Soft** (`box-shadow: 0 4px 20px -4px rgba(0,0,0,0.1)` in `index.css`; Tailwind's `shadow-soft` utility uses a lighter `0 2px 8px rgba(0,0,0,0.04)` — these two definitions disagree and should be reconciled before extending either): resting state for buttons and shallow cards.
- **Card** (`0 8px 30px -8px rgba(0,0,0,0.12)`): default elevation for product cards and content cards.
- **Elevated** (`0 12px 40px -12px rgba(0,0,0,0.15)`): hover state for interactive cards and buttons — the lift is the affordance that something is clickable.

### Named Rules
**The Hover-Lift Rule.** Interactive surfaces (buttons, product cards) start at `shadow-soft` or `shadow-card` at rest and transition to `shadow-elevated` on hover, never the reverse. Elevation communicates interactivity, not decoration.

## 5. Components

### Buttons
- **Shape:** fully pill-shaped (`rounded-full`) for the hand-rolled brand buttons (`.btn-primary`, `.btn-outline`, `.btn-gradient-coral`) used across marketing surfaces. The separate shadcn `Button` primitive in `components/ui/button.jsx` defaults to `rounded-md` — this is an intentional two-tier system (utility primitive vs. brand-styled marketing button), not a bug, but new marketing-surface CTAs should reach for the pill-shaped brand classes, not the shadcn default.
- **Primary:** coral fill, white text, `shadow-soft` at rest → `shadow-elevated` on hover, `active:scale-[0.98]` for tactile press feedback.
- **Outline:** 2px coral border, coral text, fills solid coral with white text on hover.
- **Gradient:** `--gradient-coral` background, used for the single highest-emphasis CTA on a page — not a default button style.
- **Hover / Focus:** all button variants transition over 300ms; focus-visible states must carry a visible ring (WCAG AA), matching the shadcn primitive's `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` even on the hand-rolled brand classes.

### Cards
- **Corner style:** `--radius` (0.75rem) as the base, scaling down via the `sm`/`md` Tailwind tokens for nested elements.
- **Background:** white or cream, matching the section's alternating rhythm.
- **Shadow strategy:** `shadow-card` at rest, `shadow-elevated` on hover for anything clickable (product cards); static content cards stay at `shadow-card` with no hover state.
- **Border:** none by default — cards are distinguished by shadow and background tint, not a border. Reserve a real border for input-adjacent or table-like contexts.

### Inputs / Fields
- **Style:** `border` token color, `--radius` corners, background matches `--background`.
- **Focus:** ring in `--ring` (same coral as primary), 2px offset — consistent with the button focus treatment so keyboard focus reads the same way across every interactive element.
- **Error:** `--destructive` border/text, paired with a specific, non-generic error message (see PRODUCT.md's vibe-coded-copy concern — error copy is exactly the kind of text detail that reads as templated if left generic).

### Navigation
- Inter for all nav labels, coral for the active/current-page indicator, generous horizontal spacing between items rather than dense tab-style grouping.

### Turtle Mascot (signature component)
The recurring turtle mascot (video and imagery) is the system's one intentionally playful, non-generic element — the thing least likely to be mistaken for a template. Treat it as a brand asset to feature deliberately (hero sections, empty states, success states) rather than a decorative afterthought; it's doing real differentiation work against "looks vibe-coded" feedback.

## 6. Do's and Don'ts

### Do:
- **Do** keep every color reference flowing through the HSL custom properties in `src/index.css` — no raw hex in JSX, per the project's own standing decision.
- **Do** use the pill-shaped brand button classes (`.btn-primary`, `.btn-outline`, `.btn-gradient-coral`) for marketing-surface CTAs.
- **Do** pair Playfair Display headlines with Inter body copy consistently; don't introduce a third competing typeface.
- **Do** verify body-text contrast against `cream` backgrounds specifically, not just against white — cream is a warm near-white and is the more common place contrast quietly fails.
- **Do** feature the turtle mascot deliberately in hero, empty-state, and success moments.
- **Do** write button labels, empty states, and error copy in specific, considered language — generic placeholder-shaped copy ("Learn More", "Something went wrong") is one of the concrete tells behind the "vibe-coded" feedback this project has received.

### Don't:
- **Don't** use `background-clip: text` gradient text for emphasis; the codebase has legacy instances (`.text-gradient-coral`, `.gradient-hero-text`) but they should not be extended to new copy.
- **Don't** add a tiny uppercase tracked eyebrow above every section, or numbered section markers (01/02/03) where the content isn't a genuine sequence.
- **Don't** use `border-left`/`border-right` as a colored accent stripe on cards or callouts.
- **Don't** default new CTAs to the shadcn `Button` primitive's `rounded-md` shape on marketing surfaces — that reads as generic app-shell UI, not this brand's pill-shaped signature.
- **Don't** use hard, high-contrast drop shadows anywhere; every shadow in this system is soft and diffuse.
- **Don't** let hero or hierarchy-critical headline copy overflow at tablet widths — test the actual copy at each breakpoint, not just the layout.

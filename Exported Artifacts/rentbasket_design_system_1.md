# RentBasket Design System Reference

> **Use this document before building any new page.** It captures every design token, pattern, and component in the current homepage so future pages stay visually and structurally consistent.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Vite + React (JSX, no TypeScript) |
| Styling | TailwindCSS v3 with custom config |
| Component lib | shadcn/ui (components in `src/components/ui/`) |
| Icons | `lucide-react` |
| Routing | `react-router-dom` v6 (routes in `src/App.jsx`) |
| State / Data | `@tanstack/react-query` (QueryClientProvider wraps app) |
| Path alias | `@/` → `src/` |

---

## Color Palette

All colors are defined as CSS variables in `src/index.css` and mapped in `tailwind.config.js`.

| Token | CSS Variable | Hex Approx | Tailwind class |
|---|---|---|---|
| **Primary (coral-red)** | `--primary` / `--coral` | `hsl(4, 77%, 55%)` ≈ `#D72F26` | `text-primary`, `bg-primary`, `bg-coral` |
| Coral light | `--coral-light` | `hsl(4, 77%, 65%)` | `bg-coral-light` |
| Coral dark | `--coral-dark` | `hsl(4, 77%, 45%)` | `bg-coral-dark`, `hover:bg-coral-dark` |
| **Gold accent** | `--gold` / `--accent` | `hsl(45, 100%, 51%)` ≈ `#FFBF00` | `text-gold`, `bg-gold`, `fill-gold` |
| **Cream bg** | `--cream` | `hsl(40, 33%, 97%)` | `bg-cream` |
| Background | `--background` | White `#FFFFFF` | `bg-background` |
| Foreground | `--foreground` | Near-black `#212121` | `text-foreground` |
| Muted text | `--muted-foreground` | `hsl(0,0%,45%)` ≈ `#737373` | `text-muted-foreground` |
| Card bg | `--card` | White | `bg-card` |
| Border | `--border` | `hsl(0,0%,90%)` | `border-border` |
| Secondary bg | `--secondary` | `hsl(30,10%,96%)` | `bg-secondary` |

### Brand Gradient (hero / buttons)
```
linear-gradient(86.65deg, #DF252F 15.65%, #EE1140 53.1%, #FAD694 90.55%)
```
Used as `backgroundImage` inline style on the hero headline and the primary CTA button.

---

## Typography

Two font families are imported from Google Fonts (in `src/index.css`):

| Family | Class | Usage |
|---|---|---|
| **Inter** | `font-sans` (default body) | All body copy, buttons, labels, nav |
| **Playfair Display** | `font-display` | All `h1–h6` by default; hero tagline; section headers |

### Heading scale (approximate usage across components)

| Tag | Tailwind classes |
|---|---|
| `h1` | `text-4xl xl:text-5xl 2xl:text-6xl font-normal` (HeroSection, gradient text) |
| `h2` section | `text-3xl md:text-4xl lg:text-5xl font-bold font-display` |
| `h2` testimonials | `text-4xl md:text-6xl font-bold` |
| `h3` CTA | `text-2xl md:text-3xl font-bold font-sans` |
| `h4` card title | `font-bold text-lg` |
| `h6` feature | `text-md font-semibold font-sans` |

### Special text styles
- `headline-accent` → `font-display italic text-primary` (used for "Comfort" in hero)
- `text-balance` → `text-wrap: balance`
- `underline-coral` → red underline, 3px, 4px offset

---

## Spacing & Layout

### Page container
```jsx
<div className="section-container"> … </div>
// = max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```
Use `section-container` on every section's inner wrapper.

### Section vertical padding
- Default: `py-12 md:py-20`
- Compact: `py-6 md:py-12 lg:py-16`

### Breakpoints (Tailwind defaults)
`sm` = 640px · `md` = 768px · `lg` = 1024px · `xl` = 1280px · `2xl` = 1536px

### Responsive pattern
All sections use **two sibling divs**:
```jsx
<div className="lg:hidden …">   {/* Mobile */}
<div className="hidden lg:flex …"> {/* Desktop */}
```

---

## Shadows

| Class | Value |
|---|---|
| `shadow-soft` | `0 2px 8px rgba(0,0,0,0.04)` |
| `shadow-card` | `0 4px 16px rgba(0,0,0,0.08)` |
| `shadow-elevated` | `0 8px 32px rgba(0,0,0,0.12)` |

---

## Reusable Component Classes (from `index.css`)

```css
/* Primary filled pill button */
.btn-primary
  bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium
  hover:bg-coral-dark transition-all duration-300 shadow-soft hover:shadow-elevated

/* Outlined pill button */
.btn-outline
  border-2 border-primary text-primary px-6 py-3 rounded-full font-medium
  hover:bg-primary hover:text-primary-foreground transition-all duration-300

/* Card shadow helper */
.card-shadow → box-shadow: var(--shadow-card)

/* Coral gradient bg */
.gradient-coral → linear-gradient(135deg, hsl(4,77%,60%), hsl(4,77%,50%))

/* Myth card gradient */
.gradient-myth → linear-gradient(180deg, hsl(4,70%,60%) 0%, hsl(4,77%,50%) 100%)
```

---

## Border Radius

| Token | Value |
|---|---|
| `rounded-lg` | `0.75rem` |
| `rounded-md` | `0.625rem` |
| `rounded-sm` | `0.5rem` |
| `rounded-full` | Used for all buttons |
| `rounded-2xl` | Used for product cards, testimonial cards |

---

## Animations

| Name | Behavior | Class |
|---|---|---|
| `float` | 0→-10px→0 translateY, 3s ease-in-out infinite | `animate-float` |
| `accordion-down/up` | Radix accordion expand | auto-applied by shadcn/ui |
| Hover scale | `hover:scale-105` / `hover:scale-110` | on interactive cards & nav buttons |
| Transition | `transition-all duration-300` / `duration-500` | on cards, buttons |

---

## Existing Components

### Layout
| Component | File | Description |
|---|---|---|
| `Header` | `Header.jsx` | Sticky top bar: logo (left), search input (center, desktop only), "Download App" outline btn (right) |
| `Footer` | `Footer.jsx` | Quick links + office addresses (Gurgaon & Noida), copyright |

### Homepage Sections (in order)
| Component | File | Key elements |
|---|---|---|
| `HeroSection` | `HeroSection.jsx` | Mascot video loop, gradient headline "Comfort for your home…", stats (2000+ customers, ⭐4.9), "Rent furniture… Delhi NCR" sub-text |
| `FurnitureGallery` | `FurnitureGallery.jsx` | Category tabs (Furniture / Appliances / Others / Bestsellers), auto-scroll carousel with dot indicators, desktop+mobile responsive |
| `FreeBenefits` | `FreeBenefits.jsx` | Mascot-with-sofa image, "Free: Delivery / Installation / Maintenance", two CTA buttons |
| `ResponsibilitySection` | `ResponsibilitySection.jsx` | "We don't just rent…" heading + 3 paragraphs with emojis |
| `HowItWorks` | `HowItWorks.jsx` | 4-step process with Lucide icons, vertical connector lines, mascot peek image |
| `FoundersSection` | `FoundersSection.jsx` | Father-son founder photos (stacked), founder story card |
| `MythOrFact` | `MythOrFact.jsx` | 6 flip cards (red gradient front/dark red back), `bg-gray-50` section bg |
| `Testimonials` | `Testimonials.jsx` | 3 overlapping white cards with star ratings, turtle mascot image on top |
| `WhatMakesDifferent` | `WhatMakesDifferent.jsx` | 4-column feature grid (desktop), sticky-stack cards (mobile), full-width looping video footer |
| `DownloadSection` | `DownloadSection.jsx` | App download CTA section |

### UI Primitives (shadcn/ui in `src/components/ui/`)
Toaster, Sonner (toast), Tooltip — already wired in `App.jsx`.

---

## Assets Inventory

### `src/assets/` (root level)
| File | Used in |
|---|---|
| `7 1.png` | Logo (Header, Footer fixed corner) |
| `ChatGPT Image Jan 17, 2026, 02_58_19 AM 1.png` | FreeBenefits mascot-with-sofa |
| `ec87d54077a7f60f6a6705c150a1eb36d7ebcd32.png` | HowItWorks mascot peek |
| `Untitled-22 1.png` | Testimonials turtle mascot |
| `Group 64.png` | Founder Vijay photo card |
| `Group 65.png` | Founder Hardik photo card |
| `kling_…mp4` | Hero mascot video (autoPlay loop muted) |
| `footer-video.mp4` | Full-width footer video in WhatMakesDifferent |
| `Frame 8.png` | (available, not in current use) |
| `app-mockup.png`, `iPhone 15 Pro.png`, `iPhone 16 - 6.png` | DownloadSection |
| `mascot.png`, `mascot-peek.png`, `mascot-sofa.png` | Spare mascot assets |

### `src/assets/Furniture/` → 1.png – 10.png
### `src/assets/Appliances/` → 10.png – 15.png
### `src/assets/Others/` → 15.png – 17.png
### `src/assets/Bestsellers/` → 1, 3, 5, 8–16.png

---

## Routing

```jsx
// src/App.jsx
<Route path="/"  element={<Index />} />
<Route path="*"  element={<NotFound />} />
```

**To add a new page:**
1. Create `src/pages/NewPage.jsx`
2. Import and add `<Route path="/new-page" element={<NewPage />} />` above the `*` route in `App.jsx`
3. Wrap content in `<div className="min-h-screen bg-background">` + `<Header />` + `<Footer />`

---

## Key Coding Conventions

- **No TypeScript** – all files use `.jsx`
- **Import alias** – always use `@/` not relative paths (`import X from "@/components/X"`)
- **Inline styles** – used for brand-specific values that Tailwind doesn't expose cleanly (gradients, exact hex colors, percentage widths)
- **Dual layout pattern** – every section has a `lg:hidden` mobile div and a `hidden lg:flex` desktop div side-by-side
- **Image optimization** – all product images use `object-contain` inside a `bg-gray-50` container
- **External links** – always `target="_blank" rel="noopener noreferrer"`
- **CTA links** – both buttons link to `https://www.rentbasket.com/` externally

---

## Do NOT change these for consistency

1. **Primary color** `#D72F26` → used everywhere; do not introduce new reds
2. **Font pair** Inter + Playfair Display → do not add third fonts
3. **`section-container`** wrapper on every section
4. **`btn-primary` / `btn-outline`** for all CTA buttons; never inline button styles
5. **`rounded-full`** on buttons; **`rounded-2xl`** on cards
6. **Sticky Header** — always present; do not re-implement per page

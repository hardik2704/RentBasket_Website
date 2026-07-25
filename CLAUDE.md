# RentBasket — Project Conventions

Drop this file in the root of your RentBasket project. Claude Code reads it automatically on every task and keeps new pages consistent with the rest of the site.

## Brand
- **Product**: Furniture rental for young professionals relocating between cities.
- **Tone**: Premium, warm, editorial — not SaaS-bootstrap, not big-box-retail.
- **References**: Article.com, West Elm, Linear, Vercel.
- **Mascot**: Turtle mascot appears across marketing sections (video and imagery).

## Tech stack
- React 18 + Vite
- React Router
- Tailwind CSS + shadcn/ui-style primitives under `src/components/ui/`
- Framer Motion for scroll-linked and UI animation
- TanStack Query where data fetching is used

## Design system
- **Type**: Plus Jakarta Sans (display, weight 500) + Quicksand (body, weight 500). Global heading rule applies `font-display` in `src/index.css`. The word "different" in the WhatMakesDifferent section uses a separate script accent font (`font-script` → Playwrite US Trad) — do not change it when touching global type.
- **Colors / tokens**: HSL CSS variables in `src/index.css` (`:root`). Use semantic classes (`bg-primary`, `text-muted-foreground`, `bg-cream/50`, `text-success`, `btn-gradient-coral`, etc.) — avoid raw hex in JSX unless extending tokens first.
- **Spacing**: 4px base. Use Tailwind's default scale.
- **Components**: Build from primitives in `components/ui/`. Prefer shared utilities (`btn-primary`, `btn-outline`, `btn-gradient-coral`, `gradient-coral`, `section-container`) over one-off inline styles.

## Definition of done for a new page
1. Uses tokens from `src/index.css` — no unexplained raw hex in JSX.
2. Keeps layout and typography consistent with the homepage and catalog flows.
3. Every interactive element has hover + focus-visible + sensible active states (`btn-*` classes include active scale where applicable).
4. Mobile layout reviewed at 375px width.

## Git Conventions
- **DO NOT run `git push`** unless explicitly requested by the user. Keep all commits local.


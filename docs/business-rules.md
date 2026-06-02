# Business Rules — RentBasket Website

<!-- Read before touching pricing, duration logic, cart, or checkout. -->
<!-- Kept in sync with the code. If code and this doc disagree, fix the doc. -->

## What RentBasket Is

Furniture and appliance rental for young professionals relocating between Indian cities.
Target customer: 22–32, new city, doesn't want to buy furniture for a 6–18 month stay.
Core promise: "Premium home, zero ownership headache."

## 📋 Confirmed Pricing Model

The website pricing engine is built on the confirmed backend contract in [`rentbasket-api-contract.md`](./rentbasket-api-contract.md):
- **Durations:** Monthly tiers only (`3 / 6 / 9 / 12` months). Sub-month renting is routed to the future RentBasket Mini.
- **Rent:** Derived from the base list price (`rent_3/6/9/12`) with a per-product `percent_discount` applied before tax.
- **Security Deposit:** Calculated per-unit as list rent × `security_multiple` (or 0 for quick-added recommendations).
- **GST:** 18% applied to the discounted, post-coupon Base Rent.
- **Upfront Split:** Net first month payable is split 50% upfront to confirm, 50% on delivery.

## Data access

- All product data flows through one seam: `src/api/products.js`, consumed via the hooks in
  `src/hooks/useProducts.js`. Screens never import the raw product array directly.
- Today the seam serves the mock catalog. Setting `VITE_API_BASE_URL` (and, later, the real
  auth/identity/proxy work) is what swaps mock → live, ideally as a one-file change.
- Product constants that are configuration, not records — `DURATION_OPTIONS`, `CATEGORIES`,
  `SUBCATEGORIES`, `DEFAULT_FAQ` — may still be imported directly from `src/data/products.js`.

## Rental Durations

Canonical keys live in `src/data/products.js → DURATION_OPTIONS`
(`1_day, 3_days, 7_days, 15_days, 1_month, 3_months, 6_months, 11_months, 12_months,
24_months, 36_months`). **Rule:** never hardcode duration labels in components — derive them
from `DURATION_OPTIONS`. Add a new duration there first, then to each product's pricing map.

## Categories

Shown in the catalog: `All, Furniture, Appliances, Bestsellers, Short-Term Rental,
Complete Home Setup`. `Bestsellers`, `Short-Term Rental`, and `Complete Home Setup` are
**derived** views (by tag / `best_for`), not a product's literal `category` field.
`SUBCATEGORIES` currently defines Appliance subcategories (Washing Machines, Refrigerators, …).

## Cart Rules

- Cart state lives in `CartContext.jsx` and **persists to localStorage** (`rentbasket_cart`).
  It is normalised on load — malformed/legacy items are dropped so the pricing math can't crash.
- An anonymous cart id (`rentbasket_cart_id`, see `src/lib/cartId.js`) identifies the cart for a
  future backend sync. There is no login yet, so there is no `lead_id`/`user_id` — see the
  identity open question in the API contract doc.
- A cart line item is flat:
  `{ cartItemId, productId, name, category, image, duration, durationLabel, quantity, rent, percent_discount, security_multiple, startDate, isRecommendation? }`.
- The same product can be added with different durations — they stack as separate lines.
- Same product + same duration merges (quantities add).

## Money math

- **Consolidated Pricing Engine:** All screens (Cart, Checkout, Success page, WhatsApp Handoff modal, Product details) route their calculations through `cartBreakdown` inside `src/lib/pricing.js`.
- **Discount & Savings:** Struck-out list price and a blended percentage/absolute savings are displayed on all views.
- **Coupons:** Coupon code state (e.g., `RENTBASKET10` for 10% off the base rent total before GST) is lifted to `CartContext` and persists across checkout and handoff.
- **GST:** 18% tax is calculated and displayed on the post-coupon Base Rent.
- **Refundable Security Deposit:** Scales per unit with quantity (`list rent × security_multiple × quantity`). Added recommendations set `security_multiple: 0` to preserve the promo value through duration changes.
- **No Surcharges:** Placeholder "Brand New" (+₹65/mo) and "Combo" (+₹49/₹50) surcharges are fully removed from the system.
- **Split Payment:** Net Payable (First Month) = Net Monthly Rent + Security. Upfront payment is 50%; remaining 50% is pay-on-delivery.

## Checkout Rules (MVP)

- Single page: address + schedule + payment-method selection, then "Place Order".
- **No real payment processing** — order placement is simulated, then routes to
  `/order-success` with the order payload passed via router state.
- Never collect card numbers in the frontend — defer to a payment gateway later.

## Products (mock)

- Mock product data lives in `src/data/products.js`. Product IDs are kebab-case slugs
  (e.g. `sofa-3seat-01`), used as the `/product/:id` route param.
- Any new mock product must also be added to the `staticRoutes` / productIds loop in
  `scripts/copy-spa-404.js`, or its page will 404 on GitHub Pages.

## Copy & Tone Rules

- Premium · warm · editorial. Not SaaS-bootstrap, not big-box-retail.
- Ku the turtle mascot appears in hero/marketing sections — keep him out of transactional UI
  (cart, checkout, forms).
- Price display: always `₹` prefix, no decimals for whole numbers (₹499, not ₹499.00).

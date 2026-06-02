# Phase 2 — Wire the pricing module into the cart (implementation plan)

> Goal: make the cart/checkout show the **real proposal breakdown** (list → discounted,
> savings, 18% GST, refundable security, net first month, 50% upfront) by routing every
> money calculation through `src/lib/pricing.js`, and remove the placeholder
> "Brand New" / "Combo" surcharges.
>
> Context to read first: `docs/internship-worklog.md` (pricing model, confirmed against the
> live cart) and `docs/rentbasket-api-contract.md` (live cart-item shape). The math is already
> built and unit-tested in `src/lib/pricing.js` + `src/lib/pricing.test.js` (8 passing tests).
> **Do not change the formulas** — only wire the UI to them.

## 0. The pricing module API (already built — just call it)

```js
import { cartBreakdown, discountedRent, unitSecurity } from "@/lib/pricing";

// Per unit:
discountedRent(listRent, percentDiscount) // list × (1 − pd/100), rounded
unitSecurity(listRent, securityMultiple)  // list × multiple

// Whole cart:
cartBreakdown(items, coupon) // coupon optional: { type: 'percent'|'flat', value }
//   → { totalRent, baseRent, itemSavings, coupon, netBaseRent, gst,
//       netMonthlyRent, security, netFirstMonth, upfront, payOnDelivery }
```

`cartBreakdown` reads each item via `lineOf`, which expects **either**:
- `{ rent, percent_discount, security_multiple, quantity }` (it computes discount + security), **or**
- precomputed `{ rent_with_discount, security, quantity }`.

So the cart items must carry `rent` (the **list** rent for the chosen duration), `percent_discount`, and `security_multiple`. They currently do **not** — fixing that is step 1.

## 1. Make cart items carry the pricing inputs

Today `addToCart` stores `{ productId, name, duration, durationLabel, price (discounted), quantity, startDate, deposit, image, category }`. Add three fields at every `addToCart` call site:

- `rent`: `product.pricing_by_duration[selectedDuration]` (the **list/pre-discount** rent)
- `percent_discount`: `product.percent_discount`
- `security_multiple`: `product.security_multiple`

### Special Case: Recommended Items (Zero Deposit)
For recommendation items added via `handleQuickAdd` in [CrossSellStrip.jsx](file:///g:/College/RentBasket/RentBasket_Website/src/components/cart/CrossSellStrip.jsx), set `security_multiple: 0` to preserve the zero-deposit incentive. This ensures the derived security deposit remains 0 even if the user updates the rental duration inside the cart.

Keep `price` (= discounted) for now; `deposit` becomes unused (security is derived). Call sites:
- `src/components/product/AddToCartBlock.jsx` — `handleAddToCart`
- `src/pages/ProductDetails.jsx` — `handleMobileAddToCart`
- `src/components/cart/CrossSellStrip.jsx` — `handleQuickAdd` and `handleAddAll`

In `src/components/cart/CartItemCard.jsx` → `handleDurationChange`, when the duration changes also update `rent` to the new list value: `updateItem(id, { duration, durationLabel, rent: product.pricing_by_duration[newKey], price: discountedRent(...) })`.

Optionally normalise legacy items in `CartContext.normalizeCartItem` (default `percent_discount`/`security_multiple`/`rent` from `price` if missing) so old carts don't break.

## 2. Remove the placeholder surcharges (Brand New ₹65 / Combo ₹49–50)

These are NOT in the real model. Remove:
- `src/context/CartContext.jsx`: delete `isGlobalBrandNew`, `toggleGlobalBrandNew`, and the dead `getCartTotal`. (Leave `addToCart/removeFromCart/updateItem/clearCart/getCartItemCount`.)
- `src/components/cart/CrossSellStrip.jsx`: remove the "Upgrade to Brand New" checkbox bar, `NEW_PRODUCT_SURCHARGE`, `COMBO_SURCHARGE`, `isGlobalBrandNew` usage, and the strike-through "before surcharge" UI. Quick-add just adds the discounted item.
- `src/components/cart/CartItemCard.jsx`: remove `NEW_PRODUCT_SURCHARGE`, the `item.isBrandNew` "Brand New Upgrade" rows.
- `src/components/cart/OrderSummary.jsx`, `src/components/checkout/CheckoutSummary.jsx`, `src/components/success/BookingSummary.jsx`: remove the `isBrandNew` / `hasSurcharge` / `totalSurcharge` lines (now handled by the module).
- Search the repo for `65`, `isBrandNew`, `hasSurcharge`, `COMBO_SURCHARGE`, `NEW_PRODUCT_SURCHARGE` and delete all remaining references.

## 3. Route every cart/summary screen through `cartBreakdown`

Replace the hand-rolled reducers with one call. The breakdown object gives every number.

- **`src/components/cart/OrderSummary.jsx`** — `const b = cartBreakdown(cartItems, coupon);` then render the rows in §5. Keep the coupon UI; map `RENTBASKET10` → `{ type: 'percent', value: 10 }` and pass it in. Remove the old `subtotalRent/totalSurcharge/totalDeposit/grandTotal` math.
- **`src/components/checkout/CheckoutSummary.jsx`** — same `cartBreakdown(cartItems, coupon)`; remove `COMBO_SURCHARGE`/`hasSurcharge`. (Checkout is currently a WhatsApp handoff, but keep this page correct for when self-serve returns.)
- **`src/components/cart/StickyCheckoutBar.jsx`** — show `b.netFirstMonth` (or `b.upfront` with a "50% now" caption). Replace the local `subtotalRent + totalDeposit`.
- **`src/components/cart/CartItemCard.jsx`** — per line use `lineOf(item)` (or `discountedRent`/`unitSecurity`) to show: list (struck) → discounted rent `/mo`, `× qty`, security, and a line total. Remove the daily-savings banner (durations are monthly now) or recompute it against the 12-month rate.
- **`src/components/product/PricingSummary.jsx`** — build a single-item breakdown with `cartBreakdown([{ rent: pricing[selectedDuration], percent_discount, security_multiple, quantity }])` and show GST + security + net first month + 50%, mirroring the proposal.
- **`src/pages/Checkout.jsx`** — `handlePlaceOrder`: build `orderPayload` from `cartBreakdown(cartItems, coupon)` (subtotalRent→`baseRent`, gst, security→`security`, grandTotal→`netFirstMonth`, upfront→`upfront`). Update `src/components/success/BookingSummary.jsx` + the OrderSuccess mock to the new field names.

## 4. Coupon & WhatsApp Pricing Handoff

Coupon discount applies to the **whole-cart base rent, before GST** (already implemented in `cartBreakdown`). Today coupon state lives only in `OrderSummary`. 
* **Lifting Coupon State:** For consistency across the cart, **lift coupon state into `CartContext`** (`coupon`, `applyCoupon`, `removeCoupon`) so `OrderSummary`, `CheckoutSummary`, `StickyCheckoutBar`, and the WhatsApp message all use the same value. `RENTBASKET10` = 10% off base rent.
* **WhatsApp Message Enrichment:** Update the pre-filled WhatsApp message in [CheckoutContactModal.jsx](file:///g:/College/RentBasket/RentBasket_Website/src/components/cart/CheckoutContactModal.jsx) to include the calculated totals (Base Rent, GST, Refundable Security, Coupon Applied, Total First Month, and the 50% Upfront Split) alongside the items.

## 5. Display spec — the breakdown rows (mirror proposal #2397)

Cart Order Summary should show, in order:
1. Per item: `name ×qty` — `₹{discounted}/mo` with `₹{list}` struck + `{percent_discount}% off`.
2. **Total Rent** `₹{totalRent}/mo` (struck/muted) and **Savings** `−₹{itemSavings}` (+ coupon line if any).
3. **Base Rent** `₹{netBaseRent}/mo`.
4. **GST (18%)** `₹{gst}/mo`.
5. **Net Monthly Rent** `₹{netMonthlyRent}/mo` (bold).
6. **Refundable Security** `₹{security}` (one-time).
7. **Delivery / Installation / Maintenance** — Free (monthly leases).
8. **Net Payable (First Month)** `₹{netFirstMonth}` (grand total).
9. Caption: **Pay ₹{upfront} now (50%), ₹{payOnDelivery} on delivery.**

## 6. Verify

- `npx vitest run src/lib/pricing.test.js` — must stay green (8 tests).
- Add an integration check: a cart of the two live-cart items (`rent 769, pd 30, sec_mult 2, qty 1` ×2) must produce base ₹1076, security ₹3076, net monthly ₹1270, net first month ₹4346, upfront ₹2173.
- `npm run lint` and `npm run build` clean.
- Manual: add 2 products, open cart, confirm the breakdown matches the model and the coupon reduces base-then-GST.

## Out of scope (later)
- Live API wiring (auth/identity/proxy) — replaces the mock behind the data door; the cart item shape above already matches the live `get-proposal-cart-items-for-lead` fields.
- The RentBasket Mini site (the duration-picker stub already links to a "coming soon" toast).
- Restoring full self-serve checkout (currently a WhatsApp handoff — `CheckoutContactModal`).


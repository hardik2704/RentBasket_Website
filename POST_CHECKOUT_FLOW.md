# Post-Checkout Flow — Change Summary

A developer-facing summary of everything added/changed to build the **login/signup-first checkout → KYC → order confirmation** flow.

- **Branch:** `Hardik-try` (mirror of `feat/checkout-login-signup-flow`, PR #5)
- **Base:** `main`
- **Scope:** 14 files — **4 new pages**, **10 modified** (`src/` only)
- **Stack:** React 18 + Vite + React Router + Tailwind + Framer Motion (no backend — OTP, payment, KYC are simulated client-side; cross-page data is passed via React Router `location.state`)

---

## 1. The new user journey

```
Cart
  └─ "Proceed to Checkout" / mobile sticky bar
       ↓
/customer-validation   → Login/Signup: mobile + OTP (Resend OTP w/ 30s cooldown)
       ↓ (verified phone carried forward)
/checkout              → Details only: Name + Email (mobile shown as verified),
                         Delivery Address, Rental Start date/slot
       ↓ "Order Summary"
/order-summary         → Delivery recap + order summary + coupon, then
                         "Confirm & Pay Now"  (no payment-method selector)
       ↓ (places order; navigate-before-clearCart = no empty-cart flicker)
/order-success         → "Order Confirmed" + KYC gate banner
       ↓ "Complete KYC"
/kyc                   → Upload 4 docs: Aadhaar Front, Aadhaar Back, Selfie,
                         Property Rent Agreement → "Submit & Confirm Order"
       ↓ (kycComplete = true)
/order-success         → "KYC Verified — Order Confirmed";
                         tracker advances to "Team Confirmation"
/account/orders        → My Orders (Upcoming / Active / Completed)
```

---

## 2. New pages (added)

| File | Route | What it does |
|---|---|---|
| `src/pages/CustomerValidation.jsx` | `/customer-validation` | Login/signup via mobile + OTP. Two steps (phone → OTP), **Resend OTP** with a 30s countdown, "Change mobile number". On verify → navigates to `/checkout` with `state.verifiedPhone`. Timers are unmount-safe. |
| `src/pages/OrderSummary.jsx` | `/order-summary` | Dedicated review step. Shows a "Delivering To" recap + `CheckoutSummary` + "Confirm & Pay Now". Builds the order payload, then `navigate("/order-success")` **before** `clearCart()` to avoid the empty-cart flicker. Guards: requires non-empty cart + `verifiedPhone` + `formData`. |
| `src/pages/MyOrders.jsx` | `/account/orders` | Order history with filter tabs (**Upcoming / Active / Completed**) over static mock data. Actions: **Rent Again** (re-adds items to cart → `/cart`), **Track Delivery** (WhatsApp), **Get Support** (tel). |
| `src/pages/Kyc.jsx` | `/kyc` | KYC upload page: 4 document tiles (Aadhaar Front, Aadhaar Back, Selfie, Property Rent Agreement; agreement also accepts PDF). Progress `X/4`, per-tile preview/remove, "Submit & Confirm Order" disabled until all 4 present. On submit → `navigate("/order-success", { state: { orderData, kycComplete: true } })`. Object URLs revoked + timers cleared on unmount. |

---

## 3. Modified files

### Routing
- **`src/App.jsx`** — registered the 4 new routes (`/customer-validation`, `/order-summary`, `/kyc`, `/account/orders`) and **restored both toast providers** (`<Toaster />` from `@/components/ui/toaster` and `<Sonner />` from `@/components/ui/sonner`) — without these, every `toast()` call across the new pages renders nothing.

### Cart → entry into the flow
- **`src/components/cart/OrderSummary.jsx`** — "Proceed to Checkout" now navigates to `/customer-validation` (login/signup first).
- **`src/components/cart/StickyCheckoutBar.jsx`** — mobile sticky "Checkout" button also navigates to `/customer-validation`.

### Checkout (details step)
- **`src/pages/Checkout.jsx`** — refactored to a **details-only** step. Reads `verifiedPhone` (and prior `formData` for back-navigation) from `location.state`, prefills the phone, guards the route (redirects to `/customer-validation` if unverified, `/cart` if empty), and replaces the in-page place-order with an **"Order Summary"** button → `/order-summary`. Payment-method selector removed.
- **`src/components/checkout/CheckoutForm.jsx`** — adds a **verified-mobile banner** and hides the mobile input when `phoneVerified` is true (asks only Name + Email).
- **`src/components/checkout/CheckoutSummary.jsx`** — functional **coupon** (`RENTBASKET10` = 10% off) and a corrected total: `grandTotal` now **includes** the surcharge and uses the pipeline-consistent flag/amount (`isBrandNew` / ₹65, not `hasSurcharge` / ₹50). Per-item badge → "Brand New".

### Order confirmation + KYC
- **`src/pages/OrderSuccess.jsx`** — reads `kycComplete` from `location.state`. Shows an **"Action required: Complete your KYC"** gate (with CTA → `/kyc`) when pending, and a **"KYC Verified — Order Confirmed"** banner once done. Passes `kycComplete` to `NextSteps`.
- **`src/components/success/NextSteps.jsx`** — "What happens next?" tracker now inserts a **Complete KYC** step between *Order Received* and *Team Confirmation*. Pre-KYC it's the big highlighted current step ("Action Needed"); once KYC is done it flips to ✓ and **Team Confirmation** becomes the highlighted current step.
- **`src/components/success/SuccessHero.jsx`** — removed the dead **Invoice** button; Track Order → `/account/orders`.
- **`src/components/success/SuccessSupport.jsx`** — **Get App** → `/#download`; removed dead Invoice references.

---

## 4. Cross-page data contract (no backend)

State is passed via React Router `location.state`. Keys to preserve if wiring to a real backend later:

| From → To | `state` payload |
|---|---|
| `/customer-validation` → `/checkout` | `{ verifiedPhone }` |
| `/checkout` ↔ `/order-summary` | `{ verifiedPhone, formData }` |
| `/order-summary` → `/order-success` | `{ orderData }` |
| `/order-success` → `/kyc` | `{ orderData }` |
| `/kyc` → `/order-success` | `{ orderData, kycComplete: true }` |

> Because this is `location.state`, a hard refresh loses it (route guards then redirect back). Replace with a backend/store to persist.

---

## 5. Integration notes

- **Dependencies:** uses existing deps only (`sonner`, `next-themes` via the sonner wrapper, `lucide-react`, `framer-motion`). No new packages.
- **Toast providers are required** — keep `<Toaster />` + `<Sonner />` mounted in `src/App.jsx`.
- **Surcharge math** is consistent across `src/components/cart/OrderSummary.jsx`, `src/components/checkout/CheckoutSummary.jsx`, and `src/pages/OrderSummary.jsx` (base rent split out, surcharge added back, `isBrandNew`/₹65).
- **Verification:** `npm run build` passes and ESLint is clean on all changed files. Flow was driven end-to-end in the browser.
- Not included here (kept out of this branch on purpose): build artifacts in `dist/`, `.DS_Store`, and the design-token/e2e work (that lives in a separate branch/PR).

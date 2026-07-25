/**
 * RentBasket pricing — the single source of truth for cart money math.
 *
 * Model confirmed 2026-06-02 from the live cart API and a real customer proposal.
 * See docs/rentbasket-api-contract.md and docs/internship-worklog.md.
 *
 * All money is whole rupees. Rent figures are PER MONTH for the chosen duration.
 * Flow:  list rent → per-product discount → base rent → (whole-cart coupon)
 *        → +18% GST → net monthly rent → + refundable security → net first month
 *        → 50% upfront / 50% on delivery.
 *
 * Refundable security = round(discounted_rent × 1.18) × security_multiple, per
 * item (off the per-product discount, NOT the coupon). Confirmed 2026-06-13 to
 * match the backend's confirm-proposal `monthly_rent_after_gst × multiple`.
 */

export const GST_RATE = 0.18; // 18% GST on the discounted, post-coupon base rent
export const UPFRONT_RATE = 0.5; // 50% paid upfront to confirm, rest on delivery

const round = (n) => Math.round(n);

/** Discounted monthly rent for one unit: list × (1 − percent_discount/100). */
export const discountedRent = (listRent, percentDiscount = 0) =>
  round(listRent * (1 - percentDiscount / 100));

export const DEFAULT_SECURITY_MULTIPLE = 2;

/**
 * Refundable security for one unit.
 *
 * Model (confirmed 2026-06-13, matches the backend's confirm-proposal):
 *   security = round(discounted_rent × (1 + GST)) × security_multiple
 *            = monthly_rent_after_gst × multiple
 *
 * Per item, off the per-product discount only (the whole-cart coupon does NOT
 * reduce the deposit). Round the GST-inclusive monthly rent to whole rupees
 * BEFORE multiplying, so this equals the backend's `monthly_rent_after_gst ×
 * multiple` to the rupee (e.g. sofa: round(685 × 1.18)=808, × 2 = 1616).
 *
 * @param {number} discRent  discounted monthly rent for one unit (post per-product discount, pre-GST)
 * @param {number} securityMultiple
 */
export const unitSecurity = (discRent, securityMultiple = DEFAULT_SECURITY_MULTIPLE) =>
  round(discRent * (1 + GST_RATE)) * securityMultiple;

/**
 * Per-unit refundable security for a cart item — the ONE resolution used by
 * both the UI breakdown (lineOf) and the proposal API payload, so the deposit
 * the customer sees is exactly the deposit sent to the backend.
 *
 * Resolves the discounted rent the same way lineOf does (precomputed
 * `rent_with_discount` if present, else list rent × per-product discount), adds
 * GST, then applies the multiple.
 *
 * Security resolution order for the MULTIPLE:
 *   1. security_multiple (from the API)
 *   2. DEFAULT_SECURITY_MULTIPLE — last resort so the site never shows ₹0
 * (`adv_security` is intentionally NOT used — the deposit is derived, not a
 *  stored per-product rupee value; see rentbasket-security-deposit-discrepancy.)
 */
export const unitSecurityOf = (item) => {
  const listRent = Number(item.rent ?? item.listRent ?? 0);
  const pd = Number(item.percent_discount ?? item.percentDiscount ?? 0);
  const discRent =
    item.rent_with_discount != null
      ? Number(item.rent_with_discount)
      : discountedRent(listRent, pd);
  const mult = item.security_multiple ?? item.securityMultiple ?? DEFAULT_SECURITY_MULTIPLE;
  return unitSecurity(discRent, Number(mult));
};

/**
 * Normalise a cart item to the numbers the math needs. Accepts the live API
 * shape (`rent`, `percent_discount`, `security_multiple`, `amenity_count`) and
 * also honours server-precomputed fields (`adv_security`, `rent_with_discount`)
 * when present — so the same module works for live data and the bundled mock.
 */
export const lineOf = (item) => {
  const qty = Math.max(1, Number(item.quantity ?? item.amenity_count ?? 1));
  const listRent = Number(item.rent ?? item.listRent ?? 0);
  const pd = Number(item.percent_discount ?? item.percentDiscount ?? 0);
  const disc =
    item.rent_with_discount != null
      ? Number(item.rent_with_discount)
      : discountedRent(listRent, pd);
  const sec = unitSecurityOf(item);
  return {
    qty,
    listRent,
    discountedRent: disc,
    listRentTotal: listRent * qty,
    rentTotal: disc * qty, // monthly, post-discount, pre-coupon/GST
    securityTotal: sec * qty,
  };
};

const sum = (arr, f) => arr.reduce((t, x) => t + f(x), 0);

/** Coupon applied to the WHOLE-CART base rent (not per item). */
export const couponDiscount = (baseRent, coupon) => {
  if (!coupon) return 0;
  if (coupon.type === "flat") return Math.min(baseRent, round(coupon.value));
  if (coupon.type === "percent") return round(baseRent * (coupon.value / 100));
  return 0;
};

export const gstAmount = (amount) => round(amount * GST_RATE);

/**
 * Full cart breakdown — the numbers shown on the cart / proposal.
 * @param {Array} items  live-API-shaped (or normalised) cart items
 * @param {object|null} coupon  optional { type: 'percent'|'flat', value }
 */
export const cartBreakdown = (items = [], coupon = null) => {
  const lines = items.map(lineOf);
  const totalRent = sum(lines, (l) => l.listRentTotal); // pre-discount
  const baseRent = sum(lines, (l) => l.rentTotal); // post-discount (API cart_value)
  const itemSavings = totalRent - baseRent;
  const couponValue = couponDiscount(baseRent, coupon);
  const netBaseRent = baseRent - couponValue; // base after coupon
  const gst = gstAmount(netBaseRent);
  const netMonthlyRent = netBaseRent + gst;
  const security = sum(lines, (l) => l.securityTotal);
  const netFirstMonth = netMonthlyRent + security;
  const upfront = round(netFirstMonth * UPFRONT_RATE);
  return {
    totalRent, // Σ list rent (pre-discount)
    baseRent, // Σ discounted rent (pre-GST)
    itemSavings, // totalRent − baseRent
    coupon: couponValue,
    netBaseRent, // baseRent − coupon
    gst, // 18% of netBaseRent
    netMonthlyRent, // netBaseRent + gst
    security, // refundable, Σ per-unit security × qty
    netFirstMonth, // netMonthlyRent + security
    upfront, // 50% to confirm
    payOnDelivery: netFirstMonth - upfront, // remaining 50%
  };
};

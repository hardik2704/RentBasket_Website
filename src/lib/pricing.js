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
 */

export const GST_RATE = 0.18; // 18% GST on the discounted, post-coupon base rent
export const UPFRONT_RATE = 0.5; // 50% paid upfront to confirm, rest on delivery

const round = (n) => Math.round(n);

/** Discounted monthly rent for one unit: list × (1 − percent_discount/100). */
export const discountedRent = (listRent, percentDiscount = 0) =>
  round(listRent * (1 - percentDiscount / 100));

export const DEFAULT_SECURITY_MULTIPLE = 2;

/** Refundable security for one unit: list rent × security_multiple. */
export const unitSecurity = (listRent, securityMultiple = DEFAULT_SECURITY_MULTIPLE) =>
  round(listRent * securityMultiple);

/**
 * Normalise a cart item to the numbers the math needs. Accepts the live API
 * shape (`rent`, `percent_discount`, `security_multiple`, `amenity_count`) and
 * also honours server-precomputed fields (`adv_security`, `rent_with_discount`)
 * when present — so the same module works for live data and the bundled mock.
 *
 * Security resolution order:
 *   1. adv_security / security  — pre-computed amount from the API (preferred)
 *   2. security_multiple × rent — if the multiplier is provided instead
 *   3. DEFAULT_SECURITY_MULTIPLE × rent — fallback so the site never shows ₹0
 *      deposit on items that simply have missing data
 */
export const lineOf = (item) => {
  const qty = Math.max(1, Number(item.quantity ?? item.amenity_count ?? 1));
  const listRent = Number(item.rent ?? item.listRent ?? 0);
  const pd = Number(item.percent_discount ?? item.percentDiscount ?? 0);
  const mult = item.security_multiple ?? item.securityMultiple;
  const disc =
    item.rent_with_discount != null
      ? Number(item.rent_with_discount)
      : discountedRent(listRent, pd);
  const precomputedSec = item.adv_security ?? item.security;
  const sec =
    precomputedSec != null
      ? Number(precomputedSec)
      : unitSecurity(listRent, mult != null ? Number(mult) : DEFAULT_SECURITY_MULTIPLE);
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

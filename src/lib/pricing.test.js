import { describe, it, expect } from "vitest";
import {
  discountedRent,
  unitSecurity,
  unitSecurityOf,
  couponDiscount,
  cartBreakdown,
} from "./pricing";

describe("pricing — per-unit primitives", () => {
  it("discounted rent = list × (1 − percent/100)", () => {
    expect(discountedRent(769, 30)).toBe(538); // live cart: 769 → 538
    expect(discountedRent(559, 30)).toBe(391);
    expect(discountedRent(1000, 0)).toBe(1000);
  });

  it("unit security = round(discounted rent × 1.18) × multiple", () => {
    // arg is the DISCOUNTED monthly rent; GST is folded in, then × multiple.
    expect(unitSecurity(769, 2)).toBe(1814); // round(769×1.18)=907, ×2
    expect(unitSecurity(420, 2)).toBe(992); // round(420×1.18)=496, ×2
  });

  it("unitSecurityOf = (discounted_rent + GST) × multiple, off the per-product discount", () => {
    // 769 @ 0% off → discounted 769 → round(769×1.18)=807?  (769×1.18=907.42 → 907) ×2 = 1814
    expect(unitSecurityOf({ rent: 769, security_multiple: 2 })).toBe(1814);
    expect(unitSecurityOf({ rent: 769, security_multiple: 0 })).toBe(0); // waived rec item
    // 769 @ 30% off → discounted 538 → round(538×1.18)=635 ×2 = 1270
    expect(unitSecurityOf({ rent: 769, percent_discount: 30, security_multiple: 2 })).toBe(1270);
    // adv_security is intentionally ignored now (deposit is derived, not stored)
    expect(unitSecurityOf({ rent: 769, adv_security: 1200 })).toBe(1814);
    expect(unitSecurityOf({ rent: 769 })).toBe(1814); // default 2×
  });
});

describe("pricing — verified against the live cart (lead 5383)", () => {
  // Two items, both: rent 769 (6-mo), 30% off, security_multiple 2, qty 1.
  const items = [
    { rent: 769, percent_discount: 30, security_multiple: 2, amenity_count: 1 },
    { rent: 769, percent_discount: 30, security_multiple: 2, amenity_count: 1 },
  ];

  it("base rent matches the API cart_value (₹1076)", () => {
    expect(cartBreakdown(items).baseRent).toBe(1076);
  });

  it("security total = ₹2540 (per-unit (538+GST)×2 = 1270, × 2 items)", () => {
    expect(cartBreakdown(items).security).toBe(2540);
  });

  it("full monthly + first-month breakdown", () => {
    const b = cartBreakdown(items);
    expect(b.totalRent).toBe(1538); // 769 × 2
    expect(b.gst).toBe(194); // round(1076 × 0.18)
    expect(b.netMonthlyRent).toBe(1270); // 1076 + 194
    expect(b.netFirstMonth).toBe(3810); // 1270 + 2540
    expect(b.upfront).toBe(1905); // 50%
    expect(b.payOnDelivery).toBe(1905);
  });
});

describe("pricing — reproduces the proposal bill's monthly section", () => {
  // Bill #2397: base rent 1114 → GST 201 → net monthly 1315.
  // Feed the bill's discounted rents directly via rent_with_discount.
  const items = [
    { rent: 1147, rent_with_discount: 723, security: 0, amenity_count: 1 },
    { rent: 559, rent_with_discount: 391, security: 0, amenity_count: 1 },
  ];

  it("base → GST → net monthly", () => {
    const b = cartBreakdown(items);
    expect(b.baseRent).toBe(1114);
    expect(b.gst).toBe(201); // round(1114 × 0.18) = 200.52 → 201
    expect(b.netMonthlyRent).toBe(1315);
  });
});

describe("pricing — coupon applies to whole-cart base, before GST", () => {
  it("10% coupon then GST", () => {
    const items = [
      { rent: 1000, percent_discount: 0, security_multiple: 1, amenity_count: 1 },
    ];
    const b = cartBreakdown(items, { type: "percent", value: 10 });
    expect(b.baseRent).toBe(1000);
    expect(b.coupon).toBe(100);
    expect(b.netBaseRent).toBe(900);
    expect(b.gst).toBe(162); // round(900 × 0.18)
    expect(b.netMonthlyRent).toBe(1062);
  });

  it("flat coupon is capped at the base rent", () => {
    expect(couponDiscount(500, { type: "flat", value: 800 })).toBe(500);
  });
});

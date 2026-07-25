import { describe, it, expect } from "vitest";
import { reconcileCartItems } from "./proposal";

// Mirrors the live shapes seen 2026-06-13 on lead 5474:
//   local basket items: { productId, duration: "6_months", cartItemId, ... }
//   server rows:        { id, amenity_type_id, duration: 6 (numeric), amenity_count }
// NOTE: remove/add on the backend key by amenity_type_id (one product = one cart
// slot), so reconciliation returns stale PRODUCT ids (as strings), not row ids.
const local = (productId, duration, extra = {}) => ({ productId, duration, cartItemId: `ci_${productId}_${duration}`, ...extra });
const server = (id, amenity_type_id, duration, amenity_count = 1) => ({ id, amenity_type_id, duration, amenity_count });

describe("reconcileCartItems — server/local proposal cart reconciliation", () => {
  it("empty server cart → everything is added, nothing reused or stale", () => {
    const r = reconcileCartItems([local(1042, "6_months")], []);
    expect(r.toAdd).toHaveLength(1);
    expect(r.existing).toHaveLength(0);
    expect(r.staleAmenityIds).toEqual([]);
  });

  it("item already on server (same product+duration) → reuse its id, don't re-add or remove", () => {
    // This is the "Item already in cart" case that used to hard-block the order.
    const r = reconcileCartItems(
      [local(1042, "6_months")],
      [server(13615, 1042, 6)],
    );
    expect(r.toAdd).toHaveLength(0);
    expect(r.existing).toHaveLength(1);
    expect(r.existing[0].id).toBe(13615);
    expect(r.staleAmenityIds).toEqual([]);
  });

  it("same product, DIFFERENT duration on server → remove the product, re-add at the wanted duration", () => {
    // Live case: basket wants the sofa at 6mo, server has it at 9mo. Backend keys
    // by product, so we must remove 1042 then re-add it at 6mo (a plain re-add 401s).
    const r = reconcileCartItems(
      [local(1042, "6_months")],
      [server(13615, 1042, 9)],
    );
    expect(r.toAdd).toHaveLength(1);
    expect(r.toAdd[0].duration).toBe("6_months");
    expect(r.existing).toHaveLength(0);
    expect(r.staleAmenityIds).toEqual(["1042"]);
  });

  it("server has leftover products the basket no longer contains → those products are stale", () => {
    const r = reconcileCartItems(
      [local(1042, "6_months")],
      [server(13615, 1042, 6), server(13616, 12, 3), server(13617, 1034, 12)],
    );
    expect(r.existing.map((e) => e.id)).toEqual([13615]); // sofa reused
    expect(r.toAdd).toHaveLength(0);
    expect(new Set(r.staleAmenityIds)).toEqual(new Set(["12", "1034"])); // TV + dining table products dropped
  });

  it("mixed: one reused, one added (new), one stale product", () => {
    const r = reconcileCartItems(
      [local(1042, "6_months"), local(99, "12_months")],
      [server(13615, 1042, 6), server(13620, 55, 3)],
    );
    expect(r.existing.map((e) => e.id)).toEqual([13615]);
    expect(r.toAdd.map((i) => i.productId)).toEqual([99]);
    expect(r.staleAmenityIds).toEqual(["55"]);
  });

  it("numeric vs string duration normalise (server 6 matches local '6_months')", () => {
    const r = reconcileCartItems([local(1042, "6_months")], [server(13615, 1042, 6)]);
    expect(r.existing).toHaveLength(1);
    expect(r.staleAmenityIds).toEqual([]);
  });

  it("ignores server rows without a usable id", () => {
    const r = reconcileCartItems([local(1042, "6_months")], [{ amenity_type_id: 1042, duration: 6 }]);
    // no id → can't reuse → the local item is added; the unusable row isn't tracked as stale
    expect(r.toAdd).toHaveLength(1);
    expect(r.staleAmenityIds).toEqual([]);
  });

  it("two local lines, one server row of that key → only one reuses, the other is added", () => {
    const r = reconcileCartItems(
      [local(1042, "6_months", { cartItemId: "a" }), { productId: 1042, duration: "6_months", cartItemId: "b" }],
      [server(13615, 1042, 6)],
    );
    expect(r.existing).toHaveLength(1);
    expect(r.toAdd).toHaveLength(1);
    // product is wanted AND exactly matched → not stale
    expect(r.staleAmenityIds).toEqual([]);
  });
});

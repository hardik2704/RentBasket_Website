import { authFetch } from "./client";
import { fetchProducts } from "./products";

/**
 * Order history API.
 *
 * Backend (Shivam) exposes three endpoints:
 *   GET /get-my-orders?user_id=          — thin list (id, date, status, rents)
 *   GET /get-order-details?user_id=      — rich payload (amenities, billing, address)
 *   GET /get-single-order-details?order_id= — per-item delivery status + images
 *
 * The My Orders page needs the rich payload, so we use /get-order-details.
 * Two quirks of that endpoint we normalise here:
 *   1. `data` is an OBJECT with stringified numeric keys ("0".."N") plus a stray
 *      `messageDescription` key — not an array. We pull the order objects out
 *      with Object.values() and keep only entries that have an `order_id`.
 *   2. Field names differ from the frontend shape (amenity_name, security,
 *      monthly_rent_after_gst, ...) and statuses are free-text. mapOrder()
 *      translates one backend order into the shape OrderCard expects.
 *
 * Product images: get-order-details has no image field. Rather than the N+1
 * cost of calling get-single-order-details per order, we join each item against
 * the catalog by amenity_id — fetchProducts() is already fetched/cached for the
 * rest of the site, so this is 0 extra calls in a normal session (1 if cold).
 */

/**
 * Backend order_status string → the page's status buckets: upcoming | active | completed.
 *
 * Founder (confirmed 2026-06-11) will add an explicit "Active rental" status and a
 * "Completed" status to the order table. Until those land, the API only emits
 * delivery-progress strings ("Placed", "Delivery in Progress", "Delivered"), so
 * we map what exists today and forward-recognise the coming values:
 *   - "active" / "active rental"      → active   (NEW — not yet emitted by API)
 *   - "completed" / "delivered"       → completed
 *   - everything else                 → upcoming
 *
 * The "active" branch is inert today (no order returns it) but ready the moment
 * the backend starts sending it — see the PENDING log in mapOrder().
 */
function mapStatus(orderStatus) {
  const s = String(orderStatus || "").toLowerCase().trim();
  if (s === "active" || s === "active rental") return "active";
  if (s === "completed" || s === "delivered") return "completed";
  return "upcoming";
}

/** "12" / 12 → "12 months"; "1" → "1 month". Falls back to "" when unknown. */
function durationLabel(duration) {
  const n = Number(duration);
  if (!n) return "";
  return `${n} month${n === 1 ? "" : "s"}`;
}

/** Address can be a non-empty string, an empty string, or a {location_name, city_name} object. */
function normalizeAddress(order) {
  if (typeof order.address === "string" && order.address.trim()) return order.address.trim();
  const d = order.delivery_address;
  if (d && typeof d === "object") {
    return [d.location_name, d.city_name].filter(Boolean).join(", ");
  }
  return "";
}

/**
 * Translate one backend order object into the shape OrderCard renders.
 * @param {object} order
 * @param {Map<string,string|null>} imageById  catalog amenity_id → image URL
 */
function mapOrder(order, imageById) {
  const status = mapStatus(order.order_status);
  const items = Array.isArray(order.amenities)
    ? order.amenities.map((a) => ({
        amenity_type_id: a.amenity_id,
        name: a.amenity_name,
        // get-order-details has no image; resolve it from the catalog by
        // amenity_id (null if the catalog couldn't be loaded or has no match).
        image: imageById.get(String(a.amenity_id)) ?? null,
        durationLabel: durationLabel(a.duration),
        quantity: Number(a.amenity_count) || 1,
        rent: Number(a.rent) || 0,
      }))
    : [];

  // Lifecycle date shown under the status:
  //  - upcoming → "Starts On" = the first delivery date (delivery_date).
  //  - active   → no per-order date needed; founder confirmed "renews is default",
  //               so renewsOn is intentionally NOT shown.
  //  - completed → the API still has no return / rental-end date, so we show none.
  const lifecycle = status === "upcoming"
    ? { startsOn: expectedDeliveryDate(order) || order.delivery_date }
    : {};

  return {
    orderId: String(order.order_id),
    bookingDate: order.order_date || "",
    status,
    items,
    address: normalizeAddress(order),
    // expected_delivery_date is a coming order-table field (founder 2026-06-11);
    // fall back to the existing delivery_date until it ships.
    deliveryDate: expectedDeliveryDate(order) || order.delivery_date || "",
    // expected_delivery_slot is a coming string field ("10-12", "12-2", ...).
    // Empty today; the card hides the slot until the backend sends it.
    deliverySlot: expectedDeliverySlot(order),
    monthlyRent: Number(order.monthly_rent_after_gst) || 0,
    deposit: Number(order.security) || 0,
    ...lifecycle,
  };
}

// --- Forward-compatible readers for fields the backend will add later ---------
// Founder confirmed 2026-06-11 these will be saved on the order table as strings:
//   expected_delivery_time_slot  — 2-hour window code, e.g. "4_6" (we SEND this
//                                  key on order confirmation; see src/lib/delivery.js)
//   expected_delivery_date       — the expected delivery date (YYYY-MM-DD)
// Read them defensively now (tolerant of the likely name variants) so the UI
// lights up automatically the moment they come back on the order. See logPendingFields().

function expectedDeliverySlot(order) {
  return (order.expected_delivery_time_slot ?? order.expected_delivery_slot ?? order.delivery_slot ?? "") || "";
}

function expectedDeliveryDate(order) {
  return (order.expected_delivery_date ?? "") || "";
}

/**
 * Once per fetch, log which founder-confirmed (2026-06-11) fields the API is not
 * yet sending, so we can SEE the moment Shivam ships them and then remove the
 * fallbacks. Logged once across the whole order list (not per order) to avoid
 * console spam. Safe to delete this function once all fields are live.
 */
function logPendingFields(orders) {
  if (!orders.length) return;
  const missing = [];
  if (!orders.some((o) => expectedDeliverySlot(o))) missing.push("expected_delivery_time_slot");
  if (!orders.some((o) => expectedDeliveryDate(o))) missing.push("expected_delivery_date");
  if (!orders.some((o) => mapStatus(o.order_status) === "active" || mapStatus(o.order_status) === "completed"))
    missing.push('order_status (no "Active"/"Completed" yet)');
  if (missing.length) {
    console.warn(
      "[RentBasket][orders] Awaiting backend fields (founder confirmed 2026-06-11): " +
        missing.join(", ") +
        ". UI is using fallbacks until these ship — see src/api/orders.js.",
    );
  }
}

/**
 * Fetch and normalise the logged-in user's orders.
 * @param {string|number} userId  — from getAuth().userId
 * @returns {Promise<Array>} orders in OrderCard shape, newest first
 */
export async function fetchOrders(userId) {
  // Fetch orders and the catalog (for images) together. The catalog is normally
  // already cached for the rest of the site, so this adds no real network cost;
  // if it fails, orders still render — images just fall back to a placeholder.
  const [res, products] = await Promise.all([
    authFetch(`/get-order-details?user_id=${encodeURIComponent(userId)}`),
    fetchProducts().catch(() => []),
  ]);

  const json = await res.json().catch(() => null);
  if (!res.ok || !json) {
    throw new Error(json?.data?.messageDescription || json?.message || `Orders API failed (${res.status})`);
  }
  // responseCode 201 = "no orders found" — treat as empty list, not an error
  if (json.responseCode !== 200) {
    return [];
  }

  // Build amenity_id → image lookup from the catalog (product id === amenity_type_id).
  const imageById = new Map(products.map((p) => [String(p.id), p.image ?? null]));

  // data is an object keyed "0".."N" (+ a messageDescription key) — pull out the
  // entries that are actual orders, then map and sort newest-first by order_id.
  const raw = (json.data && typeof json.data === "object" ? Object.values(json.data) : [])
    .filter((o) => o && typeof o === "object" && o.order_id != null);

  logPendingFields(raw); // surface not-yet-shipped fields in the console

  return raw
    .map((o) => mapOrder(o, imageById))
    .sort((a, b) => Number(b.orderId) - Number(a.orderId));
}

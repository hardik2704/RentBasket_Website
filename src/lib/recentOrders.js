import { safeSet } from "@/lib/safeStorage";

/**
 * Optimistic local order bridge.
 *
 * My Orders now loads the real backend list via src/api/orders.js
 * (GET /get-order-details). This module persists orders placed on THIS device
 * so a just-placed order shows immediately, bridging the window before the
 * backend reflects it. MyOrders merges these in, de-duped by orderId, and the
 * backend list is the source of truth once an order appears there.
 */

const KEY = "rentbasket_recent_orders";

export const getRecentOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

const saveRecentOrders = (orders) => safeSet(KEY, JSON.stringify(orders));

/**
 * Map the order payload built at checkout into the shape MyOrders' OrderCard
 * expects, then prepend it to the stored list (de-duped by orderId so a retry
 * of the same order doesn't create two entries).
 */
export const recordOrder = (orderPayload) => {
  if (!orderPayload?.orderId) return;
  const order = {
    orderId: String(orderPayload.orderId),
    bookingDate: orderPayload.bookingDate,
    status: "upcoming", // just placed → "Arriving Soon"
    items: (orderPayload.items || []).map((ci) => ({
      amenity_type_id: ci.productId,
      name: ci.name,
      image: ci.image,
      durationLabel: ci.durationLabel,
      quantity: ci.quantity,
      rent: Number(ci.price) || 0,
    })),
    address: orderPayload.deliveryAddress,
    deliveryDate: orderPayload.deliveryDate,
    deliverySlot: orderPayload.deliverySlot,
    monthlyRent: Number(orderPayload.netMonthlyRent) || 0,
    deposit: Number(orderPayload.security) || 0,
    startsOn: orderPayload.deliveryDate,
  };
  const list = getRecentOrders().filter((o) => o.orderId !== order.orderId);
  saveRecentOrders([order, ...list]);
};

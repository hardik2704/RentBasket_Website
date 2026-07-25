/**
 * Cart sync — pushes the (localStorage-primary) cart to the backend periodically.
 *
 * Decision from the Shivam meeting: cart stays primary in localStorage but is
 * ALSO synced to the backend on an interval so a salesperson can see it at the
 * "talk to someone" handoff.
 *
 * ⚠️ CONTRACT NOT FINAL — the endpoint, method, and body below are assumptions.
 * Confirm with Shivam, then adjust just this file. Likely shape:
 *     PUT  {API_BASE}/cart/{cartId}
 *     body: { cartId, items: [...cartItems] }
 *
 * This is a NO-OP until `VITE_API_BASE_URL` is set, so it changes nothing today.
 */
import { API_BASE } from "./config";

/** Cart sync is disabled until the handoff API contract is confirmed with Shivam. */
export const CART_SYNC_ENABLED = false;

export async function syncCart(cartId, items) {
  if (!CART_SYNC_ENABLED) return; // backend not live yet — do nothing

  const res = await fetch(`${API_BASE}/cart/${encodeURIComponent(cartId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId, items }),
  });

  if (!res.ok) {
    throw new Error(`Cart sync failed: ${res.status} ${res.statusText}`);
  }
  return res.json().catch(() => null);
}

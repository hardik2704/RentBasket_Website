/**
 * Anonymous cart id.
 *
 * There's no login, so the backend can't tell whose cart is whose. We mint a
 * random id once, persist it in localStorage, and send it with every cart sync.
 * Think of it as a wristband: the browser holds the real cart; this id is just
 * how the backend refers to it.
 */
import { safeSet } from "@/lib/safeStorage";
import { makeId } from "@/lib/utils";

const CART_ID_KEY = "rentbasket_cart_id";

export function getCartId() {
  try {
    let id = localStorage.getItem(CART_ID_KEY);
    if (!id) {
      id = makeId("cart");
      safeSet(CART_ID_KEY, id);
    }
    return id;
  } catch {
    // localStorage blocked (e.g. private mode) — fall back to an ephemeral id.
    return makeId("cart");
  }
}

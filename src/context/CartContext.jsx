import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { syncCart, CART_SYNC_ENABLED } from "@/api/cart";
import { getCartId } from "@/lib/cartId";
import { safeSet, safeGet } from "@/lib/safeStorage";
import { makeId } from "@/lib/utils";
import { DURATION_OPTIONS } from "@/data/products";
import { discountedRent } from "@/lib/pricing";

const CartContext = createContext();
const CART_STORAGE_KEY = "rentbasket_cart";
// Which duration group is currently shown in the cart. Persisted so a refresh
// keeps the user on the same plan. The cart is split by rental duration: each
// duration is its own group and, at checkout, its own order.
const SELECTED_DURATION_KEY = "rentbasket_cart_duration";
const CART_SYNC_DEBOUNCE_MS = 3000;

// Canonical ordering of duration groups (matches the picker order). Used to
// sort the durations present in the cart so the switcher is always stable.
const DURATION_ORDER = DURATION_OPTIONS.map((d) => d.key);
const durationRank = (key) => {
  const i = DURATION_ORDER.indexOf(key);
  return i === -1 ? DURATION_ORDER.length : i;
};
const labelForDuration = (key) =>
  DURATION_OPTIONS.find((d) => d.key === key)?.label || key || "";

/**
 * Unique id for a cart line item. Date.now() alone collides when several items
 * are added in the same millisecond (e.g. the "Add all" combo button), which
 * makes remove/update hit the wrong line. Delegates to the shared makeId helper.
 */
const makeCartItemId = () => makeId("ci");

/**
 * Normalise one stored cart item so the pricing math can never crash on it.
 * A cart saved by an older build may be missing fields the UI now relies on
 * (price/quantity/deposit must be numbers; every line needs an id). Returns
 * null for anything that isn't a usable item, so it gets dropped on load.
 */
const normalizeCartItem = (raw) => {
  if (!raw || typeof raw !== "object" || !raw.productId) return null;
  const toNumber = (v, fallback) => (Number.isFinite(Number(v)) ? Number(v) : fallback);
  return {
    ...raw,
    cartItemId: raw.cartItemId || makeCartItemId(),
    price: toNumber(raw.price, 0),
    quantity: Math.max(1, toNumber(raw.quantity, 1)),
    deposit: toNumber(raw.deposit, 0),
    rent: toNumber(raw.rent ?? raw.price, 0),
    percent_discount: toNumber(raw.percent_discount ?? 0, 0),
    security_multiple: raw.isRecommendation
      ? toNumber(raw.security_multiple, 0)
      : toNumber(raw.security_multiple ?? 2, 2),
    depositWaived: raw.isRecommendation ? (raw.depositWaived ?? false) : undefined,
    _realSecurityMultiple: raw._realSecurityMultiple ?? null,
    _realAdvSecurity: raw._realAdvSecurity ?? null,
  };
};

const loadCart = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeCartItem).filter(Boolean);
  } catch {
    return [];
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCart);
  const [coupon, setCoupon] = useState(null);
  // The duration group currently shown in the cart. Restored from storage on
  // load; reconciled against the durations actually present by the effect below.
  const [selectedDuration, setSelectedDurationState] = useState(
    () => safeGet(SELECTED_DURATION_KEY) || null
  );

  // Persist to localStorage on every change (primary store).
  // Uses safeSet so a write failure (private mode, quota exceeded) swallows
  // the error instead of escaping to the global ErrorBoundary.
  useEffect(() => {
    safeSet(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // The ordered list of duration groups that have at least one item.
  const durationsInCart = useMemo(() => {
    const present = [...new Set(cartItems.map((i) => i.duration).filter(Boolean))];
    return present.sort((a, b) => durationRank(a) - durationRank(b));
  }, [cartItems]);

  // Keep selectedDuration valid: if it points at an empty/absent group (e.g. the
  // last item moved away or was removed), fall back to the first group present.
  // Also seeds the selection on first load.
  useEffect(() => {
    if (durationsInCart.length === 0) {
      if (selectedDuration !== null) setSelectedDurationState(null);
      return;
    }
    if (!durationsInCart.includes(selectedDuration)) {
      setSelectedDurationState(durationsInCart[0]);
    }
  }, [durationsInCart, selectedDuration]);

  useEffect(() => {
    if (selectedDuration) safeSet(SELECTED_DURATION_KEY, selectedDuration);
  }, [selectedDuration]);

  const setSelectedDuration = (key) => setSelectedDurationState(key);

  // Items belonging to one duration group (defaults to the active group).
  const itemsForDuration = (key) => cartItems.filter((i) => i.duration === key);
  const activeItems = useMemo(
    () => cartItems.filter((i) => i.duration === selectedDuration),
    [cartItems, selectedDuration]
  );
  const groupCount = (key) =>
    cartItems.reduce((n, i) => (i.duration === key ? n + i.quantity : n), 0);

  // Recalculate deposit waiver for recommendation items whenever the cart changes.
  // A recommendation gets 0 deposit only if its price is less than the highest-priced
  // OTHER item in the cart. Runs after every cart mutation; terminates after one pass
  // because the second run finds depositWaived already matches shouldWaive for all items.
  useEffect(() => {
    const hasRecs = cartItems.some((i) => i.isRecommendation);
    if (!hasRecs) return;

    let changed = false;
    const next = cartItems.map((item) => {
      if (!item.isRecommendation) return item;

      const maxOtherPrice = cartItems
        .filter((o) => o.cartItemId !== item.cartItemId)
        .reduce((max, o) => Math.max(max, o.price ?? 0), 0);

      const shouldWaive = (item.price ?? 0) < maxOtherPrice;
      if (shouldWaive === (item.depositWaived ?? false)) return item;

      changed = true;
      return {
        ...item,
        depositWaived: shouldWaive,
        security_multiple: shouldWaive ? 0 : (item._realSecurityMultiple ?? null),
        adv_security: shouldWaive ? 0 : (item._realAdvSecurity ?? null),
      };
    });

    if (changed) setCartItems(next);
  }, [cartItems]);

  // Periodically sync the cart to the backend (debounced — fires once activity
  // settles, not on every click). No-op until VITE_API_BASE_URL is configured.
  useEffect(() => {
    if (!CART_SYNC_ENABLED) return;
    const timer = setTimeout(() => {
      syncCart(getCartId(), cartItems).catch((err) =>
        console.warn("Cart sync failed:", err)
      );
    }, CART_SYNC_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [cartItems]);

  const addToCart = (item) => {
    // Hard guard: never allow an out-of-stock product into the cart, no matter
    // which UI path called us. Callers should also disable their buttons, but
    // this is the single chokepoint that keeps a stray path from slipping through.
    if (item?.stock_status === "out_of_stock") {
      return { ok: false, reason: "out_of_stock" };
    }
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === item.productId && i.duration === item.duration
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
        };
        return updated;
      }
      return [...prev, { ...item, cartItemId: makeCartItemId() }];
    });
    return { ok: true };
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const updateItem = (cartItemId, changes) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.cartItemId === cartItemId ? { ...i, ...changes } : i
      )
    );
  };

  /**
   * Move a cart line to a different rental duration (which is also a different
   * checkout group). Recomputes rent/price for the new duration from the
   * product's pricing_by_duration. If the destination group already contains
   * the same product, the two lines are MERGED (quantities summed) so a product
   * never appears twice within one duration group — consistent with addToCart.
   *
   * Returns { moved, label } so the caller can fire the right toast:
   *   moved === false → user re-picked the same duration (no-op).
   *   label           → human label of the destination duration.
   */
  const changeItemDuration = (cartItemId, newDuration, product) => {
    const label = labelForDuration(newDuration);
    setCartItems((prev) => {
      const item = prev.find((i) => i.cartItemId === cartItemId);
      if (!item || item.duration === newDuration) return prev;

      // Resolve the new rent/price for this duration. Prefer live product
      // pricing; fall back to the item's current rent if pricing is unavailable.
      const newRent = product?.pricing_by_duration?.[newDuration] ?? item.rent;
      const newPrice = discountedRent(newRent, item.percent_discount ?? 0);

      // Is there already a line for this product in the destination group?
      const mergeTarget = prev.find(
        (i) =>
          i.cartItemId !== cartItemId &&
          i.productId === item.productId &&
          i.duration === newDuration
      );

      if (mergeTarget) {
        // Merge: drop the moved line, bump the target's quantity (capped at 10).
        return prev
          .filter((i) => i.cartItemId !== cartItemId)
          .map((i) =>
            i.cartItemId === mergeTarget.cartItemId
              ? { ...i, quantity: Math.min(10, i.quantity + item.quantity) }
              : i
          );
      }

      // No merge — just re-tag the line with the new duration + pricing.
      return prev.map((i) =>
        i.cartItemId === cartItemId
          ? {
              ...i,
              duration: newDuration,
              durationLabel: label,
              rent: newRent,
              price: newPrice,
            }
          : i
      );
    });
    return { moved: true, label };
  };

  const clearCart = () => setCartItems([]);

  /** Remove every line in one duration group — used after that group is ordered. */
  const clearGroup = (key) =>
    setCartItems((prev) => prev.filter((i) => i.duration !== key));

  const setAvailableCoupon = (couponData) => {
    setCoupon(couponData);
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Total units across the WHOLE cart. Pass a duration key to count one group.
  const getCartItemCount = (duration) =>
    cartItems.reduce(
      (count, item) =>
        duration == null || item.duration === duration
          ? count + item.quantity
          : count,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateItem,
        changeItemDuration,
        clearCart,
        clearGroup,
        getCartItemCount,
        coupon,
        setAvailableCoupon,
        removeCoupon,
        // Duration grouping
        selectedDuration,
        setSelectedDuration,
        durationsInCart,
        itemsForDuration,
        activeItems,
        groupCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;


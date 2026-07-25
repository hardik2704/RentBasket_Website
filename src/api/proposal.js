import { authFetch } from "./client";
import { unitSecurityOf } from "@/lib/pricing";

async function proposalFetch(path, body) {
  const res = await authFetch(path, { method: "POST", body });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.responseCode !== 200) {
    throw new Error(json?.data?.messageDescription || json?.message || `Proposal API failed (${res.status})`);
  }
  return json;
}

/**
 * addItemsToProposal — POSTs each cart item to the backend one at a time.
 *
 * Resilience / resume-on-retry:
 *   Pass a Map as `added` (keyed by the line's stable `cartItemId`).
 *   - Items whose key is already in `added` are skipped (dedupes retries).
 *   - Newly-added ids are written into `added` before moving to the next item,
 *     so the caller's Map is updated even if a later item throws.
 *   - On failure the thrown error carries `{ cartItemIds, failedAt }` so the
 *     caller can see what was persisted up to that point.
 *   Returns the full flat array of all cart_item_ids (pre-existing + new).
 *
 * @param {string|number} userId
 * @param {string|number} leadId
 * @param {Array}         cartItems
 * @param {Map}           [added]   — optional accumulator; mutated in place
 */
export async function addItemsToProposal(userId, leadId, cartItems, added = new Map()) {
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    // Dedupe key = the line's stable cartItemId (unique per cart line, preserved
    // across retries). NOT productId|duration: two distinct lines can share the
    // same product+duration — e.g. when a user edits one line's duration via
    // updateItem to match another — and keying on content would silently drop one.
    const dedupeKey = item.cartItemId;
    if (added.has(dedupeKey)) continue; // skip — already persisted

    let json;
    try {
      json = await proposalFetch("/add-to-proposal-for-lead", {
        user_id: String(userId),
        lead_id: String(leadId),
        amenity_type_id: item.productId,
        count: item.quantity,
        rent: item.rent,
        duration: item.duration,
        // Per-unit security via the same resolution the UI breakdown uses:
        // round(discounted_rent × 1.18) × security_multiple. Cart items never
        // carry a `deposit` field, so the old `item.deposit` silently sent
        // undefined/0 — a zero-deposit order on the backend.
        security: unitSecurityOf(item),
      });
    } catch (apiErr) {
      // Record how far we got so the caller can resume on the next attempt.
      // The error carries the ids already persisted *and* the index that failed.
      const partialIds = [...added.values()];
      const resumeErr = new Error(apiErr.message);
      resumeErr.cartItemIds = partialIds;
      resumeErr.failedAt = i;
      throw resumeErr;
    }

    const id = json.data?.cart_item_id ?? json.data?.cartItemId ?? json.data?.id;
    if (id != null) {
      // Write into the caller's Map *immediately* — before the next iteration —
      // so a failure on item i+1 still has this id recorded.
      added.set(dedupeKey, id);
    }
  }

  // Return flat array of all ids (covers both skipped and newly-added entries)
  return [...added.values()];
}

/**
 * Remove a product from the server proposal cart. Best-effort: used during
 * reconciliation to drop products the user no longer has locally. Resolves to
 * true on success, false on any failure (so a remove failure never aborts an
 * order — the caller just won't confirm that product).
 *
 * Keys on `amenity_type_id`, not the row's cart_item_id (per Shivam 2026-06-13).
 * Consistent with add-to-proposal, the server treats one product as one cart
 * slot, so this removes the product's row regardless of its stored duration.
 */
export async function removeFromProposal(userId, leadId, amenityTypeId) {
  try {
    const res = await authFetch("/remove-from-proposal-cart", {
      method: "POST",
      body: { user_id: String(userId), lead_id: String(leadId), amenity_type_id: amenityTypeId },
    });
    const json = await res.json().catch(() => null);
    return Boolean(res.ok && json && json.responseCode === 200);
  } catch {
    return false;
  }
}

/** Stable match key for a proposal line: product + rental duration.
 *  Server durations come back numeric (9) while local items use a key
 *  ("9_months"); normalise both to the leading integer so they compare. */
const durationNum = (d) => parseInt(d, 10);
const matchKey = (productId, duration) => `${productId}|${durationNum(duration)}`;

/**
 * Pure reconciliation: given the local basket and the server proposal's existing
 * rows, decide which local items are already on the server (reuse their id),
 * which must be added, and which server rows are stale and should be removed.
 *
 * Matching is by amenity_type_id + duration (NOT quantity) — a quantity change
 * on an otherwise-matching line is handled by the caller, not treated as a
 * different item. Exported for unit testing without the network.
 *
 * Because the backend keys both add and remove on `amenity_type_id` alone (one
 * product = one cart slot, regardless of duration), reconciliation is
 * product-level:
 *   - server row whose product+duration matches a local line → reuse its id.
 *   - server row for a product the basket still wants but at the WRONG duration
 *     → its product id is "conflicting": remove it, then re-add at the right
 *     duration (a plain re-add would 401 "Item already in cart").
 *   - server row for a product not in the basket at all → stale: remove it.
 *
 * @param {Array} localItems  cart items ({ productId, duration, ... })
 * @param {Array} serverRows  rows from get-proposal-cart-items-for-lead.cartItems
 *                            ({ id, amenity_type_id, duration, amenity_count })
 * @returns {{ existing: Array<{item,row,id}>, toAdd: Array, staleAmenityIds: Array }}
 */
export function reconcileCartItems(localItems = [], serverRows = []) {
  const serverByKey = new Map();      // product|duration -> { row, id }
  const serverProductIds = new Set(); // every amenity_type_id present on the server
  for (const row of serverRows) {
    const id = row?.id ?? row?.cart_item_id;
    if (id == null || row.amenity_type_id == null) continue;
    serverByKey.set(matchKey(row.amenity_type_id, row.duration), { row, id });
    serverProductIds.add(String(row.amenity_type_id));
  }

  const localProductIds = new Set(localItems.map((i) => String(i.productId)));

  const existing = [];
  const toAdd = [];
  const claimedKeys = new Set();

  for (const item of localItems) {
    const key = matchKey(item.productId, item.duration);
    const hit = serverByKey.get(key);
    if (hit && !claimedKeys.has(key)) {
      existing.push({ item, row: hit.row, id: hit.id }); // exact match → reuse
      claimedKeys.add(key);
    } else {
      toAdd.push(item); // missing, or present only at a different duration
    }
  }

  // Products to remove before adding: a server product is removed if EITHER
  //  (a) the basket doesn't contain that product at all (stale leftover), or
  //  (b) the basket wants it but no exact product+duration row matched (it's on
  //      the server at the wrong duration — must clear it so the re-add succeeds).
  const staleAmenityIds = [];
  for (const pid of serverProductIds) {
    if (!localProductIds.has(pid)) {
      staleAmenityIds.push(pid); // (a) not wanted at all
      continue;
    }
    // (b) wanted, but check whether an exact-duration match was found for it
    const matchedExactly = existing.some((e) => String(e.row.amenity_type_id) === pid);
    if (!matchedExactly) staleAmenityIds.push(pid);
  }

  return { existing, toAdd, staleAmenityIds };
}

/**
 * Reconcile the server proposal cart with the local basket, then return the
 * exact set of cart_item_ids to confirm.
 *
 * This fixes the "Item already in cart" hard-block: the server proposal cart
 * persists across sessions and drifts from the local basket. Instead of blindly
 * re-adding every local item (which 401s when a row already exists), we:
 *   1. read the server cart,
 *   2. reuse ids for items already present (matched by product + duration),
 *   3. add only the genuinely-missing items,
 *   4. remove stale server rows the basket no longer contains (best-effort),
 * so confirmation always reflects exactly what the user saw.
 *
 * Falls back to a plain add (legacy behaviour) if the server cart can't be read.
 *
 * @returns {Promise<Array>} cart_item_ids for confirmProposal, in basket order
 */
export async function reconcileProposalCart(userId, leadId, localItems, added = new Map()) {
  const data = await fetchProposalCart(userId, leadId);

  // Couldn't read the server cart → fall back to the original add path so we
  // don't make ordering *worse* than before when the read endpoint is down.
  if (!data) return addItemsToProposal(userId, leadId, localItems, added);

  const serverRows = Array.isArray(data.cartItems) ? data.cartItems : [];
  const { existing, toAdd, staleAmenityIds } = reconcileCartItems(localItems, serverRows);

  // Seed the resume accumulator with ids we already have, so a mid-add failure
  // (and retry) still knows about them.
  for (const { item, id } of existing) {
    if (item.cartItemId != null) added.set(item.cartItemId, id);
  }

  // Remove conflicting/stale PRODUCTS first (keyed by amenity_type_id) so a
  // wrong-duration leftover can't make the re-add 401 "Item already in cart".
  // Must finish before adding. Best-effort, parallel — a failed remove just
  // means that product's add may still 401 (surfaced to the user as a retry).
  await Promise.all(staleAmenityIds.map((pid) => removeFromProposal(userId, leadId, pid)));

  // Add the genuinely-missing items. We do NOT rely on the add response for the
  // new id — /add-to-proposal-for-lead returns only a message, no cart_item_id.
  if (toAdd.length) await addItemsToProposal(userId, leadId, toAdd, added);

  // Re-read the cart so every line resolves to a real server cart_item_id by
  // product+duration. This is the source of truth: it covers the just-added
  // rows (whose ids the add call never returned) and the reused ones.
  let finalRows = serverRows;
  if (toAdd.length || staleAmenityIds.length) {
    const fresh = await fetchProposalCart(userId, leadId);
    if (fresh && Array.isArray(fresh.cartItems)) finalRows = fresh.cartItems;
  }
  const idByKey = new Map();
  for (const row of finalRows) {
    const id = row?.id ?? row?.cart_item_id;
    if (id != null && row.amenity_type_id != null) {
      idByKey.set(matchKey(row.amenity_type_id, row.duration), id);
    }
  }

  // Final id set, ordered to follow the basket, matched by product+duration.
  const ids = [];
  for (const item of localItems) {
    const id = idByKey.get(matchKey(item.productId, item.duration));
    if (id != null && !ids.includes(id)) ids.push(id);
  }
  return ids;
}

/**
 * create-proposal-for-tenant — the MIDDLE step Shivam added (sent 2026-06-14,
 * previously undocumented). Called AFTER confirm-proposal-for-tenant. This is
 * the call that actually materialises the proposal RECORD and returns the
 * `proposal_id` (the ~2400-range id) that razorpay/create-order needs.
 *
 * Auth: requires the Bearer JWT (probed: POST with no token → 401 Unauthorised),
 * so it goes through proposalFetch like the other proposal endpoints — NOT like
 * the public razorpay/* routes.
 *
 * Request body (Shivam, 2026-06-14): { user_id, snapshot_id }. NOTE this keys on
 * `snapshot_id`, NOT `lead_id` — the snapshot_id comes out of the preceding
 * confirm-proposal step (it's the cart snapshot being turned into a proposal).
 *
 * Returns the `proposal_id` (the ~2400-range id) that razorpay/create-order
 * needs. Response field name still to be confirmed, so we read it defensively
 * from the likely keys. See SHIVAM-RAZORPAY-QUESTIONS.md.
 *
 * @param {string|number} userId
 * @param {string|number} snapshotId   from the confirm-proposal response
 * @returns {Promise<{ proposalId: string|number|null, raw: object }>}
 */
export async function createProposalForTenant(userId, snapshotId) {
  const json = await proposalFetch("/create-proposal-for-tenant", {
    user_id: String(userId),
    snapshot_id: snapshotId,
  });
  const d = json?.data ?? {};
  // Try the field names this id is most likely to arrive under.
  const proposalId =
    d.proposal_id ?? d.proposalId ?? d.id ?? d.proposal?.id ?? null;
  return { proposalId, raw: json };
}

/**
 * Confirm the proposal into an order.
 *
 * `delivery` carries the two extra order keys the backend accepts (founder
 * 2026-06-11): `expected_delivery_date` and `expected_delivery_time_slot`.
 * Build it with getDeliveryFields() from src/lib/delivery.js so the "no choice →
 * slot 4_6 on the 3rd day" default is applied consistently. Any keys present are
 * spread onto the request body; omit `delivery` to send neither.
 */
export async function confirmProposal(userId, leadId, cartItemIds, couponId, delivery = {}) {
  return proposalFetch("/confirm-proposal-for-tenant", {
    user_id: String(userId),
    lead_id: String(leadId),
    cart_items: cartItemIds.map((id) => ({
      cart_item_id: id,
      coupon_list: couponId != null ? [couponId] : [],
    })),
    ...delivery,
  });
}

/**
 * Fetch the backend proposal cart for a lead — used to read any pre-attached
 * coupons. Returns the `data` payload or null on error.
 */
export async function fetchProposalCart(userId, leadId) {
  const res = await authFetch(
    `/get-proposal-cart-items-for-lead?user_id=${encodeURIComponent(userId)}&lead_id=${encodeURIComponent(leadId)}`
  );
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.responseCode !== 200) return null;
  return json.data ?? null;
}

/**
 * Apply a coupon to the proposal server-side before confirmation.
 * Call this after addItemsToProposal if a coupon is available.
 */
export async function applyGlobalCoupon(userId, leadId, couponId) {
  return proposalFetch("/apply-global-coupon", {
    user_id: String(userId),
    lead_id: String(leadId),
    coupon_id: couponId,
  });
}

/**
 * Set the delivery slot and date on the proposal.
 * Params are sent as query strings (backend ignores JSON body).
 * Non-fatal — a failure here should not block order confirmation.
 *
 * @param {string|number} proposalId  — same as leadId in our flow
 * @param {string|number} slotId      — slot id from /get-delivery-slots
 * @param {string}        deliveryDate — YYYY-MM-DD
 */
export async function setDeliverySlot(proposalId, slotId, deliveryDate) {
  const res = await authFetch(
    `/set-delivery-slot?slot_id=${encodeURIComponent(slotId)}&delivery_date=${encodeURIComponent(deliveryDate)}&proposal_id=${encodeURIComponent(proposalId)}`,
    { method: "POST" },
  );
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.status) {
    throw new Error(json?.message || `set-delivery-slot failed (${res.status})`);
  }
  return json;
}

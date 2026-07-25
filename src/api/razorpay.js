/**
 * Razorpay integration — frontend port of the backend's server-rendered
 * payment page (Shivam's Laravel/Blade snippet, 2026-06-14).
 *
 * Flow this module supports (called from OrderSummary after confirmProposal):
 *   1. createRazorpayOrder(proposalId, paymentType) → { order_id, amount, currency, callback_url }
 *   2. openRazorpayCheckout(...) → loads checkout.js, opens the modal, resolves
 *      with the { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *      handler response (or rejects on dismiss).
 *   3. verifyRazorpayPayment(...) → GET razorpay/verify, resolves true on success.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * OPEN QUESTIONS FOR SHIVAM (see SHIVAM-RAZORPAY-QUESTIONS.md at repo root).
 * Until answered, this module is wired but inert: OrderSummary only routes
 * through it when isRazorpayConfigured() is true, which requires the public key.
 *   Q1. What value is `proposal_id`? (confirmProposal order_id vs leadId)
 *   Q2. How does the public key reach us? (env var vs returned by create-order)
 *   Q3. Do razorpay/* endpoints want the Bearer JWT, or are they public?
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { API_BASE } from "./config";

// Razorpay's hosted checkout script.
const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

// Q2 — public ("key id", rzp_test_… / rzp_live_…) Razorpay key. SAFE to ship in
// the bundle (it's publishable, not the secret). Read from the build env for
// now; if Shivam returns it from create-order instead, prefer that value at the
// call site and this can stay empty.
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID?.trim() || "";

/**
 * True when we have enough to drive a real Razorpay payment. Right now that's
 * just "do we have a publishable key" — without it we can't open the modal, so
 * OrderSummary falls back to its existing confirm-only flow. Flip becomes
 * automatic once VITE_RAZORPAY_KEY_ID is set in the build env (Q2).
 */
export function isRazorpayConfigured() {
  return Boolean(RAZORPAY_KEY_ID);
}

/**
 * Map our 50/50 pay model to the backend's payment_type values.
 * "min_payment"  → 50% upfront to confirm   (breakdown.upfront)
 * "full_payment" → full first-month + deposit (breakdown.netFirstMonth)
 */
export const PAYMENT_TYPE = {
  FULL: "full_payment",
  MIN: "min_payment",
};

/**
 * Lazy-load checkout.js once. Resolves when window.Razorpay is available.
 * Rejects if the script fails to load (offline / blocked).
 */
let scriptPromise = null;
export function loadRazorpayScript() {
  if (typeof window !== "undefined" && window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CHECKOUT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Razorpay script failed to load")));
      // Already loaded between the check above and now.
      if (window.Razorpay) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null; // allow a later retry
      reject(new Error("Razorpay script failed to load"));
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Build request init for razorpay/* calls.
 *
 * Q3 (confirmed by Shivam 2026-06-14): create-order and verify are OUR OWN
 * backend endpoints (a wrapper around Razorpay), and they are PUBLIC — they do
 * NOT expect the Bearer JWT. So unlike the rest of src/api/* we deliberately
 * send no Authorization header here.
 */
function razorpayInit({ method = "GET", body } = {}) {
  const headers = { Accept: "application/json" };
  const init = { method, headers };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }
  return init;
}

/**
 * POST razorpay/create-order. The backend computes the rupee amount from
 * proposal_id + payment_type (we do NOT send an amount — the server is the
 * source of truth for what to charge).
 *
 * Wire format (confirmed via Postman 2026-06-14): params go in the QUERY STRING,
 * not a JSON body — `?proposal_id=2417&payment_type=full_payment`. POST with an
 * empty body.
 *
 * Returns (confirmed): { order_id, amount, currency, callback_url }
 *   - `order_id` is RAZORPAY's order id ("order_…"), distinct from our proposal_id.
 *   - `amount` is in PAISE (e.g. 1016100 = ₹10,161.00) — Razorpay's checkout
 *     `amount` option expects paise, so it's passed straight through.
 *
 * @param {string|number} proposalId   our proposal/order id (confirm-proposal's order_id, e.g. 2417)
 * @param {string} paymentType         PAYMENT_TYPE.FULL | PAYMENT_TYPE.MIN
 * @returns {Promise<{order_id:string, amount:number, currency:string, callback_url?:string}>}
 */
export async function createRazorpayOrder(proposalId, paymentType) {
  const params = new URLSearchParams({
    proposal_id: String(proposalId),
    payment_type: paymentType,
  });
  const init = razorpayInit({ method: "POST" });
  const res = await fetch(`${API_BASE}/razorpay/create-order?${params.toString()}`, init);

  // The backend returns HTTP 200 even on errors, with a body that may be JSON
  // ({ order_id, ... } on success) OR a plain-text error string on failure
  // (e.g. 'Attempt to read property "lead_id" on null' for an unknown proposal,
  // 'Invalid request parameters.' for a missing one). So we can't trust the
  // status — we read the raw text, try to parse JSON, and treat "no order_id" as
  // a failure, surfacing the backend's actual message instead of a bare "(200)".
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch { /* non-JSON error body */ }

  if (!data || !data.order_id) {
    const backendMsg = data?.message || (text ? text.trim().slice(0, 200) : `HTTP ${res.status}`);
    console.error(
      "[razorpay] create-order failed.",
      { proposalId: String(proposalId), paymentType, status: res.status, body: backendMsg },
    );
    const err = new Error(`Couldn't start payment: ${backendMsg}`);
    err.proposalId = String(proposalId);
    err.backendBody = backendMsg;
    throw err;
  }
  return data;
}

/**
 * GET razorpay/verify — confirms the signed payment with the backend.
 * Mirrors the verify URL in Shivam's snippet exactly.
 *
 * @param {{razorpay_order_id, razorpay_payment_id, razorpay_signature}} resp
 *        the object Razorpay hands the checkout `handler`
 * @param {string|number} proposalId
 * @returns {Promise<boolean>} true when the backend reports success
 */
export async function verifyRazorpayPayment(resp, proposalId) {
  const params = new URLSearchParams({
    razorpay_order_id: resp.razorpay_order_id,
    razorpay_payment_id: resp.razorpay_payment_id,
    razorpay_signature: resp.razorpay_signature,
    proposal_id: String(proposalId),
  });
  const init = razorpayInit({ method: "GET" });
  const res = await fetch(`${API_BASE}/razorpay/verify?${params.toString()}`, init);
  const data = await res.json().catch(() => null);
  return Boolean(res.ok && data?.success);
}

/**
 * Open the Razorpay checkout modal and resolve with the verified payment result.
 *
 * Resolves:  { verified: true, paymentId, response }  on a verified payment.
 * Rejects:   on modal dismiss ("PAYMENT_CANCELLED"), order-create failure,
 *            script-load failure, or a failed signature verification.
 *
 * @param {object}   opts
 * @param {string|number} opts.proposalId
 * @param {string}   opts.paymentType                PAYMENT_TYPE.*
 * @param {string}   [opts.keyId]                    overrides RAZORPAY_KEY_ID (Q2)
 * @param {object}   [opts.prefill]                  { name, email, contact }
 * @param {string}   [opts.name]                     merchant/display name
 * @param {string}   [opts.description]
 */
export async function openRazorpayCheckout({
  proposalId,
  paymentType,
  keyId,
  prefill = {},
  name = "RentBasket",
  description,
}) {
  await loadRazorpayScript();
  const order = await createRazorpayOrder(proposalId, paymentType);

  const key = keyId || RAZORPAY_KEY_ID;
  if (!key) {
    // Q2 unresolved — we have an order but nothing to open the modal with.
    throw new Error("Razorpay key not configured");
  }

  return new Promise((resolve, reject) => {
    const options = {
      key,
      amount: order.amount,
      currency: order.currency || "INR",
      name,
      description: description || `Payment for ${proposalId}`,
      order_id: order.order_id,
      callback_url: order.callback_url,
      prefill: {
        name: prefill.name || "",
        email: prefill.email || "",
        contact: prefill.contact || "",
      },
      // Phone is hidden in Shivam's snippet (already collected/verified by us).
      config: { display: { blocks: { phone: { hide: true } } } },
      theme: { color: "#FF6B57" }, // RentBasket coral, not the snippet's default blue
      handler: async (response) => {
        try {
          const ok = await verifyRazorpayPayment(response, proposalId);
          if (ok) {
            resolve({ verified: true, paymentId: response.razorpay_payment_id, response, order });
          } else {
            reject(new Error("Payment verification failed"));
          }
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => {
          const err = new Error("Payment cancelled");
          err.code = "PAYMENT_CANCELLED";
          reject(err);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    // Surface explicit Razorpay failures (card declined, etc.) instead of
    // leaving the promise hanging.
    rzp.on("payment.failed", (resp) => {
      const err = new Error(resp?.error?.description || "Payment failed");
      err.code = "PAYMENT_FAILED";
      err.detail = resp?.error;
      reject(err);
    });
    rzp.open();
  });
}

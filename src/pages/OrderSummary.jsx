import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, MapPin, Calendar, User, Phone, Pencil } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { cartBreakdown } from "@/lib/pricing";
import { getAuth } from "@/lib/auth";
import { safeRemove } from "@/lib/safeStorage";
import { recordOrder } from "@/lib/recentOrders";
import { getDeliveryFields, slotLabel } from "@/lib/delivery";
import { reconcileProposalCart, confirmProposal, createProposalForTenant, fetchProposalCart, applyGlobalCoupon, setDeliverySlot } from "@/api/proposal";
import { isRazorpayConfigured, openRazorpayCheckout, PAYMENT_TYPE } from "@/api/razorpay";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

/** Tear down the per-checkout session state once an order is placed. */
const clearCheckoutSession = () => {
  safeRemove("rb_checkout_form", sessionStorage);
  safeRemove("rb_verified_phone", sessionStorage);
  safeRemove("rb_cart_proceed", sessionStorage);
};

const OrderSummary = () => {
  const { cartItems, itemsForDuration, selectedDuration, setSelectedDuration, clearGroup, coupon, setAvailableCoupon } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const verifiedPhone = location.state?.verifiedPhone || getAuth()?.phone || "";
  const formData = location.state?.formData || null;
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  // Full vs 50%-upfront payment choice (drives razorpay payment_type). Default
  // to the upfront/min plan the site advertises ("pay 50% now").
  const [paymentChoice, setPaymentChoice] = useState("min"); // "min" | "full"
  const orderPlacedRef = useRef(false); // sync ref so the guard effect never races
  // Hard re-entrancy lock for handlePlaceOrder. `isProcessing` (state) updates
  // asynchronously, so a fast double-click or a click while the async flow is
  // mid-flight can fire handlePlaceOrder twice — each running confirmProposal +
  // createProposalForTenant and creating a DUPLICATE backend order. This sync
  // ref blocks the second entry immediately, before React re-renders.
  const placingRef = useRef(false);

  // The duration group being ordered. Each group is confirmed as its own order;
  // on success only this group is cleared and the user returns to the cart for
  // any remaining groups.
  const checkoutDuration =
    location.state?.checkoutDuration ||
    sessionStorage.getItem("rb_checkout_duration") ||
    selectedDuration ||
    "";
  const groupItems = checkoutDuration ? itemsForDuration(checkoutDuration) : cartItems;

  // On mount, try to read any coupon the backend has pre-attached to this lead's
  // proposal and auto-apply it so the user sees the discount before confirming.
  useEffect(() => {
    const auth = getAuth();
    if (!auth?.userId || !auth?.leadId) return;
    fetchProposalCart(auth.userId, auth.leadId)
      .then((data) => {
        const c = data?.coupons;
        if (!c?.id) return;
        const type = c.discount_type === 1 ? "percent" : "flat";
        const value = c.discount_type === 1 ? c.discount_in_percent : c.absolute_discount;
        if (!value) return;
        setAvailableCoupon({ id: c.id, code: c.coupon_name, type, value });
      })
      .catch(() => {});
  }, []);

  // Accumulator for resume-on-retry: survives across handlePlaceOrder calls
  // while this page stays mounted.  Keyed by the line's stable cartItemId.
  // Passed into addItemsToProposal so already-POSTed items are skipped on retry.
  const addedItemsRef = useRef(new Map());

  // Guard: the chosen plan must have items, a verified mobile, and submitted details.
  useEffect(() => {
    if (orderPlaced || orderPlacedRef.current) return;
    if (groupItems.length === 0) {
      navigate("/basket");
    } else if (!verifiedPhone) {
      navigate("/customer-validation");
    } else if (!formData) {
      navigate("/checkout", { state: { verifiedPhone, checkoutDuration } });
    }
  }, [groupItems, navigate, verifiedPhone, formData, orderPlaced, checkoutDuration]);

  // `payment` (optional) carries the real Razorpay result once a payment is
  // taken: { transactionId, method, payment_type }. When omitted (mock /
  // pre-Razorpay flow) we fall back to a generated id so the success page still
  // renders — but a real order always passes the verified razorpay_payment_id.
  const buildOrderPayload = (b, orderId, payment = null) => ({
    orderId,
    bookingDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    deliveryDate: new Date(formData.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    deliverySlot: formData.timeSlot,
    customerDetails: {
      name: formData.fullName,
      phone: formData.phone,
      email: formData.email,
    },
    deliveryAddress: `${formData.addressLine1}, ${formData.addressLine2}, ${formData.city}, ${formData.state}, ${formData.pincode}`,
    paymentDetails: {
      method: payment?.method || (formData.paymentMethod || "online").toUpperCase(),
      transactionId: payment?.transactionId || `TXN${Math.floor(Math.random() * 900000) + 100000}`,
      // What the user actually paid now: full first-month vs 50% upfront.
      amountPaid: payment?.amountPaid ?? (payment?.payment_type === PAYMENT_TYPE.MIN ? b.upfront : b.netFirstMonth),
      paymentType: payment?.payment_type || null,
      status: "Successful",
    },
    items: groupItems,
    duration: checkoutDuration,
    totalRent: b.totalRent,
    itemSavings: b.itemSavings,
    coupon: b.coupon,
    baseRent: b.netBaseRent,
    gst: b.gst,
    netMonthlyRent: b.netMonthlyRent,
    security: b.security,
    netFirstMonth: b.netFirstMonth,
    upfront: b.upfront,
    payOnDelivery: b.payOnDelivery,
    grandTotal: b.netFirstMonth, // legacy fallback
  });

  /**
   * Finalise a placed order. Only the just-ordered duration group is cleared.
   * If other duration groups still have items, the user is sent back to the cart
   * to check those out (each is a separate order); otherwise to the success page.
   */
  const finalizeOrder = (orderPayload) => {
    orderPlacedRef.current = true;
    setOrderPlaced(true);
    recordOrder(orderPayload);

    // What's left after this group is removed?
    const remaining = cartItems.filter((i) => i.duration !== checkoutDuration);
    const remainingDurations = [...new Set(remaining.map((i) => i.duration))];

    const hasMoreGroups = remainingDurations.length > 0;

    if (hasMoreGroups) {
      // Pre-select the next group so the basket opens on it when the user goes back.
      sessionStorage.setItem("rb_checkout_duration", remainingDurations[0]);
      setSelectedDuration(remainingDurations[0]);
      safeRemove("rb_cart_proceed", sessionStorage);
    }

    toast.success("Order placed successfully!", { description: "Your rental order has been confirmed." });
    // Navigate first, then clear — same tick, so the empty cart never renders.
    navigate("/order-success", { state: { orderData: orderPayload, hasMoreGroups } });
    clearGroup(checkoutDuration);
    if (!hasMoreGroups) clearCheckoutSession();
  };

  const handlePlaceOrder = async () => {
    // Re-entrancy guard: drop any second invocation while one is in flight.
    if (placingRef.current || orderPlacedRef.current) return;
    placingRef.current = true;
    setIsProcessing(true);

    // Release the re-entrancy lock + spinner on any path that lets the user
    // retry. NOT called on success (finalizeOrder navigates away and the
    // orderPlaced guard keeps the button inert).
    const releaseLock = () => {
      placingRef.current = false;
      setIsProcessing(false);
    };

    const auth = getAuth();

    // Guard: no authenticated user/lead → we cannot place a REAL, payable order.
    //
    // SECURITY: the old behaviour here finalized a fake `RB-xxxxx` order with NO
    // payment and showed the success screen — a full payment bypass any user
    // could trigger just by clearing leadId from storage. That mock path is for
    // local development ONLY; it must never run against a real build. In
    // production we hard-stop and ask the user to re-authenticate instead of
    // ever confirming an unpaid order.
    if (!auth?.userId || !auth?.leadId) {
      if (import.meta.env.PROD) {
        console.error("[OrderSummary] Missing userId/leadId on a production order — blocking (no unpaid mock orders in prod).");
        releaseLock();
        toast.error("Please sign in again to complete your order", {
          description: "Your session expired before payment. Re-verify your number and try again.",
        });
        navigate("/customer-validation", { state: { checkoutDuration } });
        return;
      }
      // Dev-only mock so the flow is testable without a backend.
      console.warn("[OrderSummary] userId or leadId missing — DEV mock order flow (no payment).");
      setTimeout(() => {
        setIsProcessing(false);
        const b = cartBreakdown(groupItems, coupon);
        const orderPayload = buildOrderPayload(b, `RB-${Math.floor(Math.random() * 90000) + 10000}`);
        finalizeOrder(orderPayload);
      }, 2500);
      return;
    }

    try {
      // Reconcile the server proposal cart with this group before confirming.
      // The server cart persists across sessions and can already hold these
      // items (or stale ones at other durations) — a blind re-add 401s with
      // "Item already in cart". reconcileProposalCart reuses existing ids, adds
      // only what's missing, removes stale rows, and returns the exact id set.
      // The accumulator Map still gives resume-on-retry within this session.
      const cartItemIds = await reconcileProposalCart(
        auth.userId,
        auth.leadId,
        groupItems,
        addedItemsRef.current,
      );

      if (!cartItemIds.length) {
        throw new Error("We couldn't prepare your order. Please try again.");
      }

      // Set delivery slot + date on the proposal (non-fatal — don't block confirmation).
      // The endpoint wants a numeric slot id; a legacy draft may hold an old text
      // label ("Morning") — skip the call then, confirmProposal still carries the
      // resolved slot code via getDeliveryFields.
      const delivery = getDeliveryFields(formData);
      const slotId = Number(formData?.timeSlot);
      if (Number.isFinite(slotId) && slotId > 0 && delivery.expected_delivery_date) {
        await setDeliverySlot(auth.leadId, slotId, delivery.expected_delivery_date).catch((err) => {
          console.warn("[OrderSummary] set-delivery-slot failed (non-fatal):", err.message);
        });
      }

      // Apply the backend-attached coupon (if any) before confirming.
      if (coupon?.id) {
        await applyGlobalCoupon(auth.userId, auth.leadId, coupon.id).catch(() => {});
      }

      // Attach expected_delivery_date + expected_delivery_time_slot to the confirmation.
      const apiResponse = await confirmProposal(auth.userId, auth.leadId, cartItemIds, coupon?.id ?? null, delivery);

      const b = cartBreakdown(groupItems, coupon);

      // ── The real proposal id (the ~2400-range id razorpay/create-order wants)
      // comes from a TWO-step backend chain (Shivam, confirmed 2026-06-14 with a
      // real response sample):
      //   confirm-proposal-for-tenant → returns `data.snapshot_id` (e.g. 4552)
      //   create-proposal-for-tenant  ({ user_id, snapshot_id }) → returns proposal_id
      //   razorpay/create-order       (?proposal_id=…) → opens the payment
      // We previously (wrongly) sent leadId to create-order → "lead_id on null".
      // `data.snapshot_id` is the confirmed field; the extra fallbacks are belt-
      // and-braces only. See SHIVAM-RAZORPAY-QUESTIONS.md.
      const snapshotId =
        apiResponse?.data?.snapshot_id ??
        apiResponse?.data?.snapshotId ??
        null;

      let proposalId = null;
      if (snapshotId != null) {
        try {
          const { proposalId: pid } = await createProposalForTenant(auth.userId, snapshotId);
          proposalId = pid;
        } catch (cpErr) {
          console.warn("[OrderSummary] create-proposal-for-tenant failed:", cpErr.message);
        }
      } else {
        console.warn("[OrderSummary] no snapshot_id in confirm-proposal response — can't create proposal", apiResponse?.data);
      }

      // Order id we show the user. Prefer the real proposal id; fall back to a
      // readable RB-{leadId} only for display when the backend didn't give one.
      const orderId = proposalId ?? `RB-${auth.leadId}`;

      // ── Razorpay payment ─────────────────────────────────────────────────
      // proposalId (from create-proposal-for-tenant) is what razorpay/create-order
      // keys on. Open the modal, take the payment, and only finalise on a
      // *verified* payment.
      //
      // FAIL-CLOSED: by this point we have a real authenticated order (the
      // userId/leadId mock path returned at the top), so a payment is EXPECTED.
      // If the publishable key is missing (e.g. VITE_RAZORPAY_KEY_ID not set in
      // the build env) or the proposal-id chain didn't yield an id, we must NOT
      // fall through to finalizeOrder — that would confirm an UNPAID order and
      // send the user to the success page without ever charging them (the live
      // "skipped the payment page" bug). Block the order with a clear error so
      // the gap is visible instead of silently letting orders through for free.
      if (!isRazorpayConfigured()) {
        console.error(
          "[OrderSummary] Razorpay not configured (VITE_RAZORPAY_KEY_ID missing) " +
          "but reached payment for a real order — blocking to avoid an unpaid confirmation.",
        );
        releaseLock();
        toast.error("Payments are temporarily unavailable", {
          description: "We couldn't start the secure payment. Please try again shortly or contact support.",
        });
        return;
      }
      if (proposalId == null) {
        console.error(
          "[OrderSummary] No proposalId from the confirm/create-proposal chain — " +
          "blocking to avoid an unpaid confirmation.",
          apiResponse?.data,
        );
        releaseLock();
        toast.error("We couldn't prepare your payment", {
          description: "Something went out of sync while confirming your order. Please try again.",
        });
        return;
      }

      let payment = null;
      {
        // min_payment = pay 50% upfront to confirm; full_payment = whole first
        // month + deposit. Driven by the user's choice on the order summary.
        const paymentType = paymentChoice === "full" ? PAYMENT_TYPE.FULL : PAYMENT_TYPE.MIN;
        try {
          const result = await openRazorpayCheckout({
            proposalId,
            paymentType,
            prefill: {
              name: formData.fullName,
              email: formData.email,
              contact: formData.phone || verifiedPhone,
            },
            description: `RentBasket order ${orderId}`,
          });
          // Defense in depth: openRazorpayCheckout only resolves after the
          // backend verify returned success, so a verified payment MUST carry a
          // payment id. If it somehow doesn't, do NOT finalise as paid — treat
          // it as a failed payment so we never confirm an order we can't tie to
          // a real Razorpay transaction.
          if (!result?.verified || !result?.paymentId) {
            throw new Error("Payment could not be confirmed");
          }
          payment = {
            transactionId: result.paymentId,
            method: "RAZORPAY",
            payment_type: paymentType,
          };
        } catch (payErr) {
          // Cancelled or failed payment: the order is confirmed on the backend
          // but unpaid. Don't finalise — let the user retry the payment.
          releaseLock();
          if (payErr?.code === "PAYMENT_CANCELLED") {
            toast.error("Payment cancelled", { description: "Your order is held — try again to pay and confirm." });
          } else if (payErr?.code === "PAYMENT_FAILED") {
            // Razorpay reported the charge itself failed (declined, etc.) — no
            // money moved, safe to retry.
            toast.error("Payment failed", { description: payErr?.message || "Please try again." });
          } else {
            // Verification-stage failure (e.g. verify said not-success, or the
            // verify request errored). A charge MAY have gone through, so steer
            // the user to support instead of blindly re-paying and double-charging.
            toast.error("We couldn't confirm your payment", {
              description: "If money was deducted, do not pay again — contact support and we'll sort it out.",
            });
          }
          return;
        }
      }

      const orderPayload = buildOrderPayload(b, String(orderId), payment);

      // Reset the resume accumulator so the NEXT group's checkout starts clean
      // (these ids belong to the group we just confirmed).
      addedItemsRef.current = new Map();
      finalizeOrder(orderPayload);
    } catch (err) {
      // err.cartItemIds is set by addItemsToProposal when it fails mid-loop;
      // those ids are already in addedItemsRef.current so a retry will skip them.
      // Map the raw "Item already in cart" backend string (which should no longer
      // occur after reconciliation, but can if the read failed) to actionable copy.
      const raw = err?.message || "";
      const friendly = /already in cart/i.test(raw)
        ? "Something went out of sync with your basket. Please try placing the order again."
        : raw || "Couldn't place your order. Please try again.";
      toast.error(friendly);
      releaseLock();
    }
  };

  if (!orderPlaced && (groupItems.length === 0 || !verifiedPhone || !formData)) return null;

  const addressLine = formData
    ? [formData.addressLine1, formData.addressLine2, formData.landmark, formData.city, formData.state, formData.pincode]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <div className="min-h-screen bg-background">
      <CheckoutHeader />

      <main className="pb-20 bg-[#FAF9F6]/70 min-h-[calc(100vh-73px)]">
        <div className="section-container pt-4 md:pt-6">
          {/* Back to details */}
          <div className="mb-6 md:mb-8">
            <Link
              to="/checkout"
              state={{ verifiedPhone, formData }}
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Edit Details
            </Link>
            <div className="mt-4">
              <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">
                Order Summary
              </h1>
              <p className="text-[11px] md:text-sm text-muted-foreground font-medium mt-1">
                Review your rental, then confirm and pay.
              </p>
            </div>
          </div>

          <CheckoutProgress currentStep="payment" />

          <div className="max-w-xl mx-auto mt-4 md:mt-8 space-y-6">
            {/* Delivery recap */}
            {formData && (
              <div className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-border/50 bg-secondary/10 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Delivering To</h3>
                  <Link
                    to="/checkout"
                    state={{ verifiedPhone, formData }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:underline"
                  >
                  <Pencil className="w-3 h-3" />
                  Edit
                </Link>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <div className="flex items-center gap-2.5 text-foreground">
                  <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-semibold">{formData.fullName}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+91 {formData.phone}</span>
                </div>
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{addressLine}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Starts{" "}
                    {new Date(formData.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {slotLabel(formData.timeSlot) ? ` · ${slotLabel(formData.timeSlot)}` : ""}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Order summary + Confirm & Pay */}
          <CheckoutSummary
            onPlaceOrder={handlePlaceOrder}
            isProcessing={isProcessing}
            items={groupItems}
            paymentChoice={paymentChoice}
            onPaymentChoiceChange={setPaymentChoice}
          />
        </div>
      </div>
    </main>
  </div>
  );
};

export default OrderSummary;

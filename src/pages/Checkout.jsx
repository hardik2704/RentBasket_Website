import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Truck, Clock, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { getAuth, setAuth } from "@/lib/auth";
import { safeSet, safeGet } from "@/lib/safeStorage";
import { getUserAddress, saveUserAddress } from "@/api/address";
import { updateUserProfile } from "@/api/profile";
import { dateNDaysFromToday } from "@/lib/delivery";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import CheckoutForm from "@/components/checkout/CheckoutForm";

const CHECKOUT_FORM_KEY = "rb_checkout_form";

/** Read a persisted checkout draft from sessionStorage, or null. */
const loadCheckoutDraft = () => {
  try {
    return JSON.parse(safeGet(CHECKOUT_FORM_KEY, sessionStorage)) || null;
  } catch {
    return null;
  }
};

const DEFAULT_FORM = {
  fullName: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  pincode: "",
  city: "",
  state: "",
  startDate: dateNDaysFromToday(2),
  timeSlot: null,
  instructions: "",
  paymentMethod: "upi",
};

const Checkout = () => {
  const { cartItems, itemsForDuration, selectedDuration } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const verifiedPhone = location.state?.verifiedPhone || sessionStorage.getItem("rb_verified_phone") || getAuth()?.phone || "";

  // The duration group being checked out (each group is its own order). Resolved
  // from explicit nav state, the value the cart stashed, then the active group.
  const checkoutDuration =
    location.state?.checkoutDuration ||
    sessionStorage.getItem("rb_checkout_duration") ||
    selectedDuration ||
    "";
  const groupItems = checkoutDuration ? itemsForDuration(checkoutDuration) : cartItems;

  // Persist verifiedPhone so navigating back to checkout doesn't lose it.
  useEffect(() => {
    if (location.state?.verifiedPhone) {
      safeSet("rb_verified_phone", location.state.verifiedPhone, sessionStorage);
    }
  }, []);

  // Pre-fill address fields from the user's saved address if the form doesn't
  // already have address data (i.e. no draft). Fire-and-forget — a failure here
  // just means the user fills in the fields manually.
  const addressPrefilled = useRef(false);
  useEffect(() => {
    if (!verifiedPhone || addressPrefilled.current) return;
    addressPrefilled.current = true;
    const auth = getAuth();
    getUserAddress(verifiedPhone).catch(() => null).then((addr) => {
      setFormData((prev) => {
        if (prev.addressLine1 && prev.email) return prev; // draft already complete — don't overwrite
        return {
          ...prev,
          fullName: prev.fullName || addr?.contact_name || auth?.name || "",
          email: prev.email || auth?.email || "",
          addressLine1: prev.addressLine1 || addr?.address_line_1 || "",
          addressLine2: prev.addressLine2 || addr?.address_line_2 || "",
          landmark: prev.landmark || addr?.landmark || "",
          pincode: prev.pincode || addr?.pincode || "",
          city: prev.city || addr?.city || "",
          state: prev.state || addr?.state || "",
        };
      });
      if (addr?.servicable === 0) {
        toast.error("We don't deliver to your area yet", {
          description: `${addr.city || "Your city"} is not in our delivery zone. Please contact us to check availability.`,
          duration: 8000,
        });
      }
    }).catch(() => {});
  }, [verifiedPhone]);

  // Enforce flow order: the chosen plan must have items, and mobile must be
  // verified first.
  useEffect(() => {
    if (groupItems.length === 0) {
      navigate("/basket");
      toast.error("Your basket is empty", {
        description: "Add some items before checking out.",
      });
    } else if (!sessionStorage.getItem("rb_cart_proceed")) {
      navigate("/basket");
    } else if (!verifiedPhone) {
      navigate("/customer-validation", { state: { returnTo: "/checkout" } });
    }
  }, [groupItems, navigate, verifiedPhone]);

  // Prefill order: defaults < persisted draft < API address < explicit state from "Edit Details"
  // < explicit state from "Edit Details" on the order summary.
  const [formData, setFormData] = useState(() => {
    const draft = loadCheckoutDraft() || {};
    return {
      ...DEFAULT_FORM,
      ...draft,
      ...(location.state?.formData || {}),
      phone: verifiedPhone || location.state?.formData?.phone || draft.phone || "",
    };
  });

  // Persist the draft so leaving checkout and coming back (e.g. to log in / verify
  // OTP) never loses the name / email / date / instructions the user already typed.
  useEffect(() => {
    safeSet(CHECKOUT_FORM_KEY, JSON.stringify(formData), sessionStorage);
  }, [formData]);

  const handleReviewSummary = () => {
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.pincode) {
      toast.error("Please fill required fields", {
        description: "Name, Address, and Pincode are mandatory.",
      });
      return;
    }
    const minDate = dateNDaysFromToday(2);
    if (!formData.startDate || formData.startDate < minDate) {
      toast.error("Please pick a later start date", {
        description: "We need at least 2 days to prepare your delivery.",
      });
      return;
    }
    const auth = getAuth();

    // Silently sync name + email to profile API so they appear in account details.
    if (auth?.userId) {
      const nameParts = (formData.fullName || "").trim().split(" ");
      updateUserProfile({
        user_id: auth.userId,
        first_name: nameParts[0] || "",
        last_name: nameParts.slice(1).join(" "),
        email: formData.email || auth?.email || "",
        address: "",
        org_name: "",
        about_me: "",
        social_media_links: "",
        reg_mobile_num: auth?.phone ?? "",
      }).then(() => {
        setAuth({ ...getAuth(), name: formData.fullName || auth?.name, email: formData.email || auth?.email });
      }).catch(() => {});
    }

    // Silently sync the address back so it pre-fills on the next order.
    if (formData.addressLine1) {
      saveUserAddress(formData.phone || verifiedPhone, {
        address_line_1: formData.addressLine1,
        address_line_2: formData.addressLine2 || "",
        landmark: formData.landmark || "",
        pincode: formData.pincode,
        city: formData.city,
        state: formData.state,
        contact_name: formData.fullName,
        contact_phone: formData.phone || verifiedPhone,
      }).catch(() => {});
    }
    navigate("/order-summary", { state: { verifiedPhone, formData, checkoutDuration } });
  };

  if (groupItems.length === 0 || !verifiedPhone) return null;

  return (
    <div className="min-h-screen bg-background">
      <CheckoutHeader />

      <main className="pb-20 bg-[#FAF9F6]/70 min-h-[calc(100vh-73px)]">
        <div className="section-container pt-4 md:pt-6">
          {/* Breadcrumb / Back Link */}
          <div className="mb-6 md:mb-8">
            <Link
              to="/basket"
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Review Basket
            </Link>
            <div className="mt-4">
              <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">
                Checkout
              </h1>
              <p className="text-[11px] md:text-sm text-muted-foreground font-medium mt-1">
                Enter your delivery details — you'll review the order summary next.
              </p>
            </div>
          </div>

          <CheckoutProgress currentStep="checkout" />

          <div className="max-w-3xl mx-auto mt-4 md:mt-8">
            {/* Trust Banner */}
            <div className="flex flex-wrap items-center gap-4 bg-secondary border border-border/50 rounded-2xl p-4 mb-8">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-black uppercase tracking-wider">Secured Rental</span>
              </div>
              <div className="h-4 w-px bg-border hidden md:block" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Free Delivery & Setup</span>
              </div>
              <div className="h-4 w-px bg-border hidden md:block" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">24/48 Hr Installation</span>
              </div>
            </div>

            <CheckoutForm formData={formData} setFormData={setFormData} phoneVerified={Boolean(verifiedPhone)} />

            {/* Proceed to Order Summary */}
            <button
              onClick={handleReviewSummary}
              className="gradient-coral w-full py-4 rounded-2xl font-black text-lg shadow-lg shadow-primary/30 transition-all hover:shadow-primary/40 hover:opacity-95 active:scale-[0.98] flex items-center justify-center gap-3 group"
            >
              Order Summary
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Bottom Note */}
            <p className="text-xs text-muted-foreground text-center py-4 mt-3 bg-secondary/20 rounded-2xl border border-dashed border-border/50 font-medium">
              Need help with your order? <a href="tel:+919959858473" className="text-foreground font-semibold hover:underline">Chat with us</a> for instant setup support.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;

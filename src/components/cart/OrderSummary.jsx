import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Tag, ShieldCheck, Lock, Truck, Wrench, CreditCard, Bookmark } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const MONTHLY_KEYS = new Set(["1_month", "3_months", "6_months", "9_months", "12_months"]);

const OrderSummary = () => {
  const { cartItems, getCartItemCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const itemCount = getCartItemCount();

  // Calculate totals
  const subtotalRent = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalDeposit = cartItems.reduce(
    (sum, item) => sum + item.deposit,
    0
  );
  const discount = couponApplied ? Math.round(subtotalRent * 0.1) : 0;
  const grandTotal = subtotalRent - discount + totalDeposit;

  const hasMonthlyItems = cartItems.some((item) => MONTHLY_KEYS.has(item.duration));

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "RENTBASKET10") {
      setCouponApplied(true);
      toast.success("Coupon applied!", {
        description: "10% discount on rental subtotal",
      });
    } else if (couponCode.trim()) {
      toast.error("Invalid coupon code", {
        description: "Try RENTBASKET10 for 10% off",
      });
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponCode("");
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-soft lg:sticky lg:top-24">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 md:px-6 md:pt-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Order Summary
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="px-5 pb-5 md:px-6 md:pb-6 space-y-4">
        {/* Per-item breakdown */}
        <div className="space-y-2">
          {cartItems.map((item) => {
            const isM = MONTHLY_KEYS.has(item.duration);
            return (
              <div key={item.cartItemId} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground truncate max-w-[60%]">
                  {item.name} {item.quantity > 1 && `×${item.quantity}`}
                </span>
                <span className="font-medium whitespace-nowrap">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}{isM && "/mo"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border/50 pt-3 space-y-2.5">
          {/* Subtotal */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Subtotal Rent</span>
            <span className="text-sm font-semibold">
              ₹{subtotalRent.toLocaleString("en-IN")}
              {hasMonthlyItems && <span className="text-xs text-muted-foreground font-normal">/mo</span>}
            </span>
          </div>

          {/* Deposit */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Security Deposit</span>
            <span className="text-sm font-medium">₹{totalDeposit.toLocaleString("en-IN")}</span>
          </div>

          {/* Surcharges */}
          {cartItems.some(i => i.hasSurcharge) && (
            <div className="flex items-center justify-between text-primary/80">
              <span className="text-sm flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5" />
                Bundle Setup Fees
              </span>
              <span className="text-sm font-medium">
                ₹{cartItems.reduce((sum, i) => sum + (i.hasSurcharge ? 50 * i.quantity : 0), 0).toLocaleString("en-IN")}
                {hasMonthlyItems && <span className="text-xs font-normal">/mo</span>}
              </span>
            </div>
          )}

          {/* Discount */}
          {couponApplied && (
            <div className="flex items-center justify-between text-green-600">
              <span className="text-sm flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Coupon Discount
              </span>
              <span className="text-sm font-semibold">−₹{discount.toLocaleString("en-IN")}</span>
            </div>
          )}

          {/* Free services */}
          <div className="border-t border-border/50 pt-2.5 space-y-1.5">
            {[
              { label: "Delivery", icon: Truck },
              { label: "Installation", icon: Wrench },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Free
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                Maintenance
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                <CheckCircle className="w-3.5 h-3.5" />
                Included
              </span>
            </div>
          </div>
        </div>

        {/* Grand Total */}
        <div className="border-t-2 border-primary/20 pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold">Grand Total Due Now</span>
            <span className="text-2xl font-bold text-primary">
              ₹{grandTotal.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground mt-1.5 flex items-start gap-1">
            <ShieldCheck className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-600" />
            Security deposit is fully refundable as per rental terms.
          </p>
        </div>

        {/* Coupon Input */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs font-medium text-muted-foreground mb-2">Have a coupon?</p>
          {couponApplied ? (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                <Tag className="w-4 h-4" />
                RENTBASKET10 applied
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="text-xs text-red-500 hover:underline font-medium"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1 px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
                onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2.5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="space-y-2.5 pt-2">
          <button
            className="btn-primary w-full py-3.5 text-base font-semibold flex items-center justify-center gap-2"
            style={{
              background:
                "linear-gradient(89.03deg, #D72F26 -14.8%, #EF1040 50.11%, #FECC87 129.44%)",
            }}
            onClick={() =>
              toast.success("Proceeding to checkout...", {
                description: "Checkout page will be available soon",
              })
            }
          >
            <Lock className="w-4 h-4" />
            Proceed to Checkout
          </button>
          <Link
            to="/catalog"
            className="btn-outline w-full py-3 text-sm text-center block"
          >
            Continue Browsing
          </Link>
          <a
            href="tel:+919958858473"
            className="block text-center text-xs text-muted-foreground hover:text-primary transition-colors mt-1"
          >
            Need help choosing more items?
          </a>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 pt-3 border-t border-border/50">
          {[
            { icon: ShieldCheck, label: "Secure" },
            { icon: Truck, label: "Free Delivery" },
            { icon: CreditCard, label: "Easy Payment" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Icon className="w-3 h-3" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

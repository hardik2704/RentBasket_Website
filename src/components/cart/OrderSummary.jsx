import { Link } from "react-router-dom";
import { CheckCircle, Tag, ShieldCheck, Lock, Truck, Wrench, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cartBreakdown, lineOf } from "@/lib/pricing";
import { DURATION_OPTIONS } from "@/data/products";

const MONTHLY_KEYS = new Set(["3_months", "6_months", "9_months", "12_months"]);
const planLabel = (key) => DURATION_OPTIONS.find((d) => d.key === key)?.label || "";

const OrderSummary = ({ onCheckout }) => {
  // The cart is split by duration; the summary, totals and checkout apply to the
  // ACTIVE duration group only (each group is its own order).
  const { activeItems, getCartItemCount, coupon, selectedDuration, durationsInCart } = useCart();
  const hasMultiplePlans = durationsInCart.length > 1;

  const itemCount = getCartItemCount(selectedDuration);
  const b = cartBreakdown(activeItems, coupon);

  if (activeItems.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-soft lg:sticky lg:top-24">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 md:px-6 md:pt-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-foreground/80" />
          Order Summary
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your {selectedDuration ? `${planLabel(selectedDuration)} ` : ""}plan
        </p>
      </div>

      <div className="px-5 pb-5 md:px-6 md:pb-6 space-y-4">
        {/* Per-item breakdown */}
        <div className="space-y-2">
          {activeItems.map((item) => {
            const isM = MONTHLY_KEYS.has(item.duration);
            const line = lineOf(item);
            return (
              <div key={item.cartItemId} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground truncate max-w-[60%]">
                  {item.name} {item.quantity > 1 && `×${item.quantity}`}
                </span>
                <span className="font-medium whitespace-nowrap flex items-center gap-1">
                  {line.listRentTotal > line.rentTotal && (
                    <span className="text-muted-foreground text-[10px]">₹{line.listRentTotal.toLocaleString("en-IN")}</span>
                  )}
                  <span>₹{line.rentTotal.toLocaleString("en-IN")}{isM && "/mo"}</span>
                </span>
              </div>
            );
          })}
        </div>
        <div className="border-t border-border/50 pt-3 space-y-2.5">
          {/* Total Rent (list total) */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Rent</span>
            <span className="text-muted-foreground text-xs">
              ₹{b.totalRent.toLocaleString("en-IN")}/mo
            </span>
          </div>

          {/* Savings */}
          {b.itemSavings > 0 && (
            <div className="flex items-center justify-between text-sm text-success">
              <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Item Savings</span>
              <span>−₹{b.itemSavings.toLocaleString("en-IN")}/mo</span>
            </div>
          )}

          {/* Coupon discount */}
          {b.coupon > 0 && (
            <div className="flex items-center justify-between text-sm text-success font-semibold">
              <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Coupon Discount</span>
              <span>−₹{b.coupon.toLocaleString("en-IN")}/mo</span>
            </div>
          )}

          {/* Base Rent */}
          <div className="flex items-center justify-between text-sm border-t border-border/30 pt-2 font-medium">
             <span className="text-muted-foreground">Base Rent</span>
             <span>₹{b.netBaseRent.toLocaleString("en-IN")}/mo</span>
          </div>

          {/* GST */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>GST (18%)</span>
            <span>₹{b.gst.toLocaleString("en-IN")}/mo</span>
          </div>

          {/* Net Monthly Rent */}
          <div className="flex items-center justify-between text-sm font-bold border-t border-border/30 pt-2">
            <span>Net Monthly Rent</span>
            <span>₹{b.netMonthlyRent.toLocaleString("en-IN")}/mo</span>
          </div>

          {/* Deposit */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Refundable Security</span>
            <span className="font-semibold">₹{b.security.toLocaleString("en-IN")}</span>
          </div>

          {/* Free services */}
          <div className="border-t border-border/50 pt-2.5 space-y-1.5">
            {[
              { label: "Delivery & Installation", icon: Truck },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-success">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Free
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                Maintenance & Support
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-success">
                <CheckCircle className="w-3.5 h-3.5" />
                Included
              </span>
            </div>
          </div>
        </div>

        {/* Grand Total */}
        <div className="border-t border-border pt-4 bg-secondary/10 -mx-5 px-5 pb-2">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-base font-bold">Total (First Month)</span>
            <span className="text-2xl font-black text-foreground tracking-tight">
              ₹{b.netFirstMonth.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed">
            Pay <strong className="text-foreground">₹{b.upfront.toLocaleString("en-IN")}</strong> now (50%), and <strong className="text-foreground">₹{b.payOnDelivery.toLocaleString("en-IN")}</strong> on delivery.
          </p>
        </div>

        {/* CTAs */}
        <div className="space-y-2.5 pt-2">
          <button
            className="btn-gradient-coral w-full py-3.5 text-base font-semibold flex items-center justify-center gap-2"
            onClick={onCheckout}
          >
            <Lock className="w-4 h-4" />
            {hasMultiplePlans ? `Checkout ${planLabel(selectedDuration)} plan` : "Proceed to Checkout"}
          </button>
          {hasMultiplePlans && (
            <p className="text-[11px] text-muted-foreground text-center">
              You have {durationsInCart.length} rental plans — each is checked out as a separate order.
            </p>
          )}
          <Link
            to="/catalog"
            className="btn-outline w-full py-3 text-sm text-center block"
          >
            Continue Browsing
          </Link>
          <a
            href="tel:+919959858473"
            className="block text-center text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
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

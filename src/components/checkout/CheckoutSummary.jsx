import { useState } from "react";
import { ShieldCheck, Info, Tag, Bookmark, Truck, Wrench, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { cartBreakdown, lineOf } from "@/lib/pricing";

const MONTHLY_KEYS = new Set([
  "1_month",
  "3_months",
  "6_months",
  "11_months",
  "12_months",
  "24_months",
  "36_months",
]);
const CheckoutSummary = ({ onPlaceOrder, isProcessing }) => {
  const { cartItems, getCartItemCount, coupon, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState(coupon?.code || "");
  
  if (cartItems.length === 0) return null;

  const itemCount = getCartItemCount();
  const b = cartBreakdown(cartItems, coupon);
  const hasMonthlyItems = cartItems.some((item) => MONTHLY_KEYS.has(item.duration));

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    applyCoupon(couponCode);
  };

  return (
    <div className="lg:sticky lg:top-24 space-y-5">
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/50 bg-secondary/10">
          <h3 className="text-base font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Order Summary
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">
            {itemCount} {itemCount === 1 ? "Item" : "Items"} in your rental plan
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Items Preview */}
          <div className="space-y-4">
            {cartItems.map((item) => {
              const line = lineOf(item);
              return (
                <div key={item.cartItemId} className="flex gap-3 pb-4 border-b border-border/30 last:border-0 last:pb-0">
                  <div className="w-14 h-14 bg-white rounded-lg border border-border/50 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                      {item.durationLabel} • {item.quantity} {item.quantity === 1 ? "Unit" : "Units"}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                        {line.listRentTotal > line.rentTotal && (
                          <span className="line-through text-muted-foreground text-[9px]">₹{line.listRentTotal.toLocaleString("en-IN")}</span>
                        )}
                        <span>₹{line.rentTotal.toLocaleString("en-IN")}/mo</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Total Rent</span>
              <span className="line-through text-muted-foreground text-xs">₹{b.totalRent.toLocaleString("en-IN")}/mo</span>
            </div>

            {b.itemSavings > 0 && (
              <div className="flex items-center justify-between text-sm text-success">
                <span className="text-muted-foreground font-medium">Item Savings</span>
                <span>−₹{b.itemSavings.toLocaleString("en-IN")}/mo</span>
              </div>
            )}

            {b.coupon > 0 && (
              <div className="flex items-center justify-between text-sm text-success font-semibold">
                <span className="text-muted-foreground font-medium">Coupon Discount</span>
                <span>−₹{b.coupon.toLocaleString("en-IN")}/mo</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm border-t border-border/30 pt-2 font-medium">
              <span className="text-muted-foreground">Base Rent</span>
              <span>₹{b.netBaseRent.toLocaleString("en-IN")}/mo</span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>GST (18%)</span>
              <span>₹{b.gst.toLocaleString("en-IN")}/mo</span>
            </div>

            <div className="flex items-center justify-between text-sm font-bold border-t border-border/30 pt-2">
              <span>Net Monthly Rent</span>
              <span>₹{b.netMonthlyRent.toLocaleString("en-IN")}/mo</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Refundable Security</span>
              <span className="font-bold">₹{b.security.toLocaleString("en-IN")}</span>
            </div>

            <div className="pt-2 space-y-2 border-t border-border/50">
              {[
                { label: "Delivery & Installation", icon: Truck },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-2 font-medium uppercase tracking-wider">
                    <Icon className="w-3 h-3" />
                    {label}
                  </span>
                  <span className="text-[11px] font-bold text-success flex items-center gap-1 uppercase tracking-wider">
                    <CheckCircle className="w-3 h-3" />
                    Free
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground flex items-center gap-2 font-medium uppercase tracking-wider">
                  <Wrench className="w-3 h-3" />
                  Maintenance & Support
                </span>
                <span className="text-[11px] font-bold text-success uppercase tracking-wider">Included</span>
              </div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="border-t-2 border-primary/10 pt-5 bg-primary/[0.01] -mx-6 px-6 pb-2">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-base font-bold text-foreground">Total (First Month)</span>
              <span className="text-2xl font-black text-primary tracking-tight">
                ₹{b.netFirstMonth.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-2 leading-relaxed text-right">
              Pay <strong className="text-foreground">₹{b.upfront.toLocaleString("en-IN")}</strong> now (50%), rest on delivery.
            </p>
            <div className="flex items-center gap-1.5 text-success bg-success-muted px-2.5 py-1.5 rounded-xl border border-success-border mt-3 shadow-sm justify-center">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <p className="text-[10px] font-bold leading-tight uppercase tracking-wider">
                Full Security Deposit Refundable
              </p>
            </div>
          </div>

          {/* Coupon */}
          <div className="pt-4 border-t border-border/50">
            {coupon ? (
              <div className="flex items-center justify-between bg-success-muted border border-success-border rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2 text-success-muted-foreground text-sm font-medium">
                  <Tag className="w-4 h-4" />
                  {coupon.code} applied
                </div>
                <button
                  onClick={() => {
                    removeCoupon();
                    setCouponCode("");
                  }}
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

          {/* CTA */}
          <button
            onClick={onPlaceOrder}
            disabled={isProcessing}
            className="gradient-coral w-full py-4 rounded-2xl font-black text-lg shadow-lg shadow-primary/30 transition-all hover:shadow-primary/40 hover:opacity-95 active:scale-[0.98] disabled:opacity-70 disabled:grayscale flex items-center justify-center gap-3 group"
          >
            {isProcessing ? "Processing..." : "Confirm & Pay Now"}
            {!isProcessing && <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">→</div>}
          </button>
          
          <p className="text-center text-[10px] text-muted-foreground font-medium flex items-center justify-center gap-1.5 opacity-70">
            <ShieldCheck className="w-3 h-3" />
            100% Encrypted & Secure Checkout
          </p>
        </div>
      </div>

      {/* Trust Badges under CTA */}
      <div className="grid grid-cols-2 gap-3 px-1">
        {[
          { icon: Info, label: "No Hidden Charges" },
          { icon: ShieldCheck, label: "Trust Guaranteed" },
        ].map((badg, idx) => (
          <div key={idx} className="flex items-center gap-2 p-3 bg-card border border-border rounded-2xl shadow-sm">
            <div className="w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
              <badg.icon className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold text-foreground leading-tight uppercase tracking-wider">{badg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSummary;

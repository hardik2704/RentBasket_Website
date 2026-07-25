import { ShieldCheck, Info, Tag, Truck, Wrench, CheckCircle, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { cartBreakdown, lineOf } from "@/lib/pricing";

const CheckoutSummary = ({ onPlaceOrder, isProcessing, items, paymentChoice = "min", onPaymentChoiceChange }) => {
  const { activeItems, coupon, removeCoupon } = useCart();
  // The order being placed is a single duration group. Callers pass that group
  // as `items`; default to the active group for any standalone use.
  const groupItems = items ?? activeItems;

  if (groupItems.length === 0) return null;

  const itemCount = groupItems.reduce((n, i) => n + (i.quantity || 0), 0);
  const b = cartBreakdown(groupItems, coupon);

  return (
    <div className="lg:sticky lg:top-24 space-y-5">
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/50 bg-secondary/10">
          <h3 className="text-base font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-foreground/80" />
            Order Summary
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">
            {itemCount} {itemCount === 1 ? "Item" : "Items"} in your rental plan
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Items Preview */}
          <div className="space-y-4">
            {groupItems.map((item) => {
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
                      <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                        {line.listRentTotal > line.rentTotal && (
                          <span className="text-muted-foreground text-[9px]">₹{line.listRentTotal.toLocaleString("en-IN")}</span>
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
              <span className="text-muted-foreground text-xs">₹{b.totalRent.toLocaleString("en-IN")}/mo</span>
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
          <div className="border-t border-border pt-5 bg-secondary/10 -mx-6 px-6 pb-2">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-base font-bold text-foreground">Total (First Month)</span>
              <span className="text-2xl font-black text-foreground tracking-tight">
                ₹{b.netFirstMonth.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Payment choice — Full vs 50% upfront. Drives razorpay payment_type. */}
            <div className="mt-3 space-y-2.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Choose how much to pay now
              </p>
              {[
                {
                  id: "min",
                  title: "Pay 50% Now",
                  amount: b.upfront,
                  sub: `₹${b.payOnDelivery.toLocaleString("en-IN")} on delivery`,
                },
                {
                  id: "full",
                  title: "Pay Full Amount",
                  amount: b.netFirstMonth,
                  sub: "Nothing due on delivery",
                },
              ].map((opt) => {
                const isSelected = paymentChoice === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onPaymentChoiceChange?.(opt.id)}
                    aria-pressed={isSelected}
                    className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-xl border-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 active:scale-[0.99] ${
                      isSelected
                        ? "border-foreground bg-foreground/5 ring-1 ring-foreground/20"
                        : "border-border bg-background hover:border-foreground/35 hover:bg-secondary/20"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors ${
                          isSelected ? "bg-foreground border-foreground text-background" : "border-border text-transparent"
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3px]" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground">
                          {opt.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium leading-tight">{opt.sub}</p>
                      </div>
                    </div>
                    <span className="text-base font-black tracking-tight flex-shrink-0 text-foreground">
                      ₹{opt.amount.toLocaleString("en-IN")}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 text-success bg-success-muted px-2.5 py-1.5 rounded-xl border border-success-border mt-3 shadow-sm justify-center">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <p className="text-[10px] font-bold leading-tight uppercase tracking-wider">
                Full Security Deposit Refundable
              </p>
            </div>
          </div>

          {/* Coupon — auto-surfaced from backend, no manual entry */}
          {coupon && (
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-between bg-success-muted border border-success-border rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2 text-success-muted-foreground text-sm font-medium">
                  <Tag className="w-4 h-4" />
                  {coupon.code} — save {coupon.type === "percent" ? `${coupon.value}%` : `₹${coupon.value}`}
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-500 hover:underline font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={onPlaceOrder}
            disabled={isProcessing}
            className="gradient-coral w-full py-4 rounded-2xl font-black text-lg shadow-lg shadow-primary/30 transition-all hover:shadow-primary/40 hover:opacity-95 active:scale-[0.98] disabled:opacity-70 disabled:grayscale flex items-center justify-center gap-3 group"
          >
            {isProcessing
              ? "Processing..."
              : `Confirm & Pay ₹${(paymentChoice === "full" ? b.netFirstMonth : b.upfront).toLocaleString("en-IN")}`}
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
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-foreground flex-shrink-0">
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

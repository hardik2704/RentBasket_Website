import { ShieldCheck, Info, Tag, Bookmark, Truck, Wrench, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

const MONTHLY_KEYS = new Set(["1_month", "3_months", "6_months", "9_months", "12_months"]);
const COMBO_SURCHARGE = 50;

const CheckoutSummary = ({ onPlaceOrder, isProcessing }) => {
  const { cartItems, getCartItemCount } = useCart();
  
  if (cartItems.length === 0) return null;

  const itemCount = getCartItemCount();
  const subtotalRent = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDeposit = cartItems.reduce((sum, item) => sum + item.deposit, 0);
  const totalSurcharge = cartItems.reduce((sum, item) => sum + (item.hasSurcharge ? COMBO_SURCHARGE * item.quantity : 0), 0);
  
  // For checkout, we'll assume a fixed 10% discount if they reached this far as a "Checkout Special" 
  // or just use the same logic as Cart if we want to be strict.
  // I'll stick to basic totals for now.
  const grandTotal = subtotalRent + totalDeposit;
  const hasMonthlyItems = cartItems.some((item) => MONTHLY_KEYS.has(item.duration));

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
            {cartItems.map((item) => (
              <div key={item.cartItemId} className="flex gap-3 pb-4 border-b border-border/30 last:border-0 last:pb-0">
                <div className="w-14 h-14 bg-gray-50 rounded-lg border border-border/50 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground line-clamp-1">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                    {item.durationLabel} • {item.quantity} {item.quantity === 1 ? "Unit" : "Units"}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] font-bold text-primary">₹{item.price.toLocaleString("en-IN")}/mo</span>
                    {item.hasSurcharge && (
                      <span className="text-[9px] text-primary/70 bg-primary/5 px-1.5 py-0.5 rounded-full font-bold border border-primary/10">
                        Combo Deal
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Monthly Rent</span>
              <span className="font-bold">₹{subtotalRent.toLocaleString("en-IN")}/mo</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Security Deposit</span>
              <span className="font-bold">₹{totalDeposit.toLocaleString("en-IN")}</span>
            </div>

            {totalSurcharge > 0 && (
              <div className="flex items-center justify-between text-sm text-primary/80 italic font-medium">
                <span className="flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5" />
                  Bundle Setup Fees
                </span>
                <span>+₹{totalSurcharge.toLocaleString("en-IN")}/mo</span>
              </div>
            )}

            <div className="pt-2 space-y-2 border-t border-border/50">
              {[
                { label: "Delivery", icon: Truck },
                { label: "Installation", icon: Wrench },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-2 font-medium uppercase tracking-wider">
                    <Icon className="w-3 h-3" />
                    {label}
                  </span>
                  <span className="text-[11px] font-bold text-green-600 flex items-center gap-1 uppercase tracking-wider">
                    <CheckCircle className="w-3 h-3" />
                    Free
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground flex items-center gap-2 font-medium uppercase tracking-wider">
                  <Wrench className="w-3 h-3" />
                  Maintenance
                </span>
                <span className="text-[11px] font-bold text-green-600 uppercase tracking-wider">Included</span>
              </div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="border-t-2 border-primary/10 pt-5 bg-primary/[0.01] -mx-6 px-6 pb-2">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-base font-bold text-foreground">Total Due Today</span>
              <span className="text-2xl font-black text-primary tracking-tight">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2.5 py-1.5 rounded-xl border border-green-100 mt-3 shadow-sm">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <p className="text-[10px] font-bold leading-tight uppercase tracking-wider">
                Full Security Deposit Refundable
              </p>
            </div>
          </div>

          {/* Coupon */}
          <div className="pt-4 border-t border-border/50">
            <div className="relative group">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="PROMO10" 
                className="w-full pl-10 pr-20 py-3 bg-secondary/40 border border-border rounded-xl text-sm font-bold placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors border border-primary/10">
                Apply
              </button>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onPlaceOrder}
            disabled={isProcessing}
            style={{
              background: "linear-gradient(89.03deg, #D72F26 -14.8%, #EF1040 50.11%, #FECC87 129.44%)",
            }}
            className="w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg shadow-primary/30 transition-all hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-70 disabled:grayscale flex items-center justify-center gap-3 group"
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

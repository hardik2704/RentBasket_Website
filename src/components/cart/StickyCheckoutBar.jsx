import { useCart } from "@/context/CartContext";
import { Lock } from "lucide-react";
import { cartBreakdown } from "@/lib/pricing";

const StickyCheckoutBar = ({ onCheckout }) => {
  const { cartItems, getCartItemCount, coupon } = useCart();

  if (cartItems.length === 0) return null;

  const b = cartBreakdown(cartItems, coupon);
  const itemCount = getCartItemCount();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-sm border-t border-border shadow-elevated">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-primary">
              ₹{b.upfront.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              Pay 50% Now
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground truncate">
            {itemCount} {itemCount === 1 ? "item" : "items"} · ₹{b.netFirstMonth.toLocaleString("en-IN")} first month total
          </p>
        </div>
        <button
          onClick={onCheckout}
          className="btn-gradient-coral px-6 py-2.5 text-sm font-semibold whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1.5"
        >
          <Lock className="w-3.5 h-3.5" />
          Checkout
        </button>
      </div>
    </div>
  );
};

export default StickyCheckoutBar;

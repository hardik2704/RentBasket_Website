import { useCart } from "@/context/CartContext";
import { Lock } from "lucide-react";
import { toast } from "sonner";

const StickyCheckoutBar = () => {
  const { cartItems, getCartItemCount } = useCart();

  if (cartItems.length === 0) return null;

  const subtotalRent = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalDeposit = cartItems.reduce(
    (sum, item) => sum + item.deposit,
    0
  );
  const grandTotal = subtotalRent + totalDeposit;
  const itemCount = getCartItemCount();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-sm border-t border-border shadow-elevated">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-primary">
              ₹{grandTotal.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground truncate">
            {itemCount} {itemCount === 1 ? "item" : "items"} · Rent + Deposit
          </p>
        </div>
        <button
          onClick={() =>
            toast.success("Proceeding to checkout...", {
              description: "Checkout page will be available soon",
            })
          }
          className="btn-primary px-6 py-2.5 text-sm font-semibold whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1.5"
          style={{
            background:
              "linear-gradient(89.03deg, #D72F26 -14.8%, #EF1040 50.11%, #FECC87 129.44%)",
          }}
        >
          <Lock className="w-3.5 h-3.5" />
          Checkout
        </button>
      </div>
    </div>
  );
};

export default StickyCheckoutBar;

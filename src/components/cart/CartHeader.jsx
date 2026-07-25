import { ShoppingBag, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const CartHeader = () => {
  const { getCartItemCount } = useCart();
  const count = getCartItemCount();

  return (
    <div className="section-container pt-6 pb-4 md:pt-8 md:pb-6">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest mb-4"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Continue Shopping
      </Link>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Your Basket
            {count > 0 && (
              <span className="ml-2 text-base md:text-lg font-semibold text-muted-foreground">
                ({count} {count === 1 ? "item" : "items"})
              </span>
            )}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;

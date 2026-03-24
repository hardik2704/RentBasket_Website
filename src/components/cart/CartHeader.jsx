import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const CartHeader = () => {
  const { getCartItemCount } = useCart();
  const count = getCartItemCount();

  return (
    <div className="section-container pt-6 pb-4 md:pt-8 md:pb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Your Cart
            {count > 0 && (
              <span className="ml-2 text-base md:text-lg font-semibold text-muted-foreground">
                ({count} {count === 1 ? "item" : "items"})
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review your selected products, rental durations, and pricing
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;

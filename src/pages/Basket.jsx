import Footer from "@/components/Footer";
import CartHeader from "@/components/cart/CartHeader";
import CartDurationTabs from "@/components/cart/CartDurationTabs";
import CartItemsList from "@/components/cart/CartItemsList";
import OrderSummary from "@/components/cart/OrderSummary";
import CrossSellStrip from "@/components/cart/CrossSellStrip";
import StickyCheckoutBar from "@/components/cart/StickyCheckoutBar";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isAuthenticated, getAuth } from "@/lib/auth";
import { safeSet } from "@/lib/safeStorage";

const Basket = () => {
  const { cartItems, selectedDuration } = useCart();
  const hasItems = cartItems.length > 0;
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    safeSet("rb_cart_proceed", "1", sessionStorage);
    // Carry the duration group being checked out — each group is its own order.
    safeSet("rb_checkout_duration", selectedDuration || "", sessionStorage);
    if (isAuthenticated()) {
      navigate("/checkout", { state: { verifiedPhone: getAuth()?.phone || "" } });
    } else {
      toast.success("Let's verify your mobile to continue");
      navigate("/customer-validation", { state: { returnTo: "/checkout" } });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20 lg:pb-0 bg-[#FAF9F6]/70 min-h-screen">
        <CartHeader />

        <div className="section-container pb-10 md:pb-16">
          {hasItems ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Basket Items */}
              <div id="basket-items" className="lg:col-span-2">
                <CartDurationTabs />
                <CartItemsList />
                <CrossSellStrip />
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary onCheckout={handleProceedToCheckout} />
              </div>
            </div>
          ) : (
            <CartItemsList />
          )}
        </div>
      </main>

      <StickyCheckoutBar onCheckout={handleProceedToCheckout} />
      <Footer />
    </div>
  );
};

export default Basket;

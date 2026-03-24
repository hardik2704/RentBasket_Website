import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartHeader from "@/components/cart/CartHeader";
import CartItemsList from "@/components/cart/CartItemsList";
import OrderSummary from "@/components/cart/OrderSummary";
import CrossSellStrip from "@/components/cart/CrossSellStrip";
import StickyCheckoutBar from "@/components/cart/StickyCheckoutBar";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { cartItems } = useCart();
  const hasItems = cartItems.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20 lg:pb-0">
        <CartHeader />

        <div className="section-container pb-10 md:pb-16">
          {hasItems ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Cart Items */}
              <div className="lg:col-span-2">
                <CartItemsList />
                <CrossSellStrip />
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary />
              </div>
            </div>
          ) : (
            <CartItemsList />
          )}
        </div>
      </main>

      <StickyCheckoutBar />
      <Footer />
    </div>
  );
};

export default Cart;

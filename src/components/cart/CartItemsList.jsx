import { useCart } from "@/context/CartContext";
import CartItemCard from "@/components/cart/CartItemCard";
import EmptyCart from "@/components/cart/EmptyCart";

const CartItemsList = () => {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <CartItemCard key={item.cartItemId} item={item} />
      ))}
    </div>
  );
};

export default CartItemsList;

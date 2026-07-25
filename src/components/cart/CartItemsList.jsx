import { useCart } from "@/context/CartContext";
import CartItemCard from "@/components/cart/CartItemCard";
import EmptyCart from "@/components/cart/EmptyCart";

const CartItemsList = () => {
  // Only the active duration group is shown. EmptyCart covers a truly empty
  // cart; the selected group is reconciled in CartContext so it always points
  // at a non-empty group when any items exist.
  const { cartItems, activeItems } = useCart();

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="space-y-4">
      {activeItems.map((item) => (
        <CartItemCard key={item.cartItemId} item={item} />
      ))}
    </div>
  );
};

export default CartItemsList;

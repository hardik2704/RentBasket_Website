import { createContext, useContext, useState, useEffect } from "react";
import { safeSet } from "@/lib/safeStorage";

const WishlistContext = createContext(null);
const STORAGE_KEY = "rentbasket_wishlist";

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    safeSet(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isInWishlist = (productId) => items.some((p) => p.id === productId);

  const toggleWishlist = (product) => {
    setItems((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const removeFromWishlist = (productId) =>
    setItems((prev) => prev.filter((p) => p.id !== productId));

  const getWishlistCount = () => items.length;

  return (
    <WishlistContext.Provider value={{ items, isInWishlist, toggleWishlist, removeFromWishlist, getWishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};

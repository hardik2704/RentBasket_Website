import { Link } from "react-router-dom";
import { Heart, ChevronLeft, Trash2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import ProductCard from "@/components/catalog/ProductCard";
import { useWishlist } from "@/context/WishlistContext";

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-background">
      <main className="section-container py-8 md:py-12">
        {/* Back link */}
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest mb-6"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Browse Catalogue
        </Link>

        {/* Heading */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center">
              <Heart className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black font-display text-foreground tracking-tight">
                My Wishlist
              </h1>
              <p className="text-[11px] md:text-sm text-muted-foreground font-medium mt-0.5">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={() => items.forEach((p) => removeFromWishlist(p.id))}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-secondary border border-border/50 flex items-center justify-center mb-5">
              <Heart className="w-9 h-9 text-foreground/40" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Nothing saved yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-7">
              Tap the heart on any product to save it here for later.
            </p>
            <Link to="/catalog" className="btn-gradient-coral inline-flex px-6 py-3 text-sm font-semibold">
              Browse Catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            <AnimatePresence mode="popLayout">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;

import { forwardRef, useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import { DURATION_OPTIONS } from "@/data/products";
import { discountedRent } from "@/lib/pricing";
import { productUrl } from "@/lib/share";
import ProductImage from "@/components/ui/ProductImage";

const ProductCard = forwardRef(({ product, displayDuration }, ref) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);
  const [showPricingLadder, setShowPricingLadder] = useState(false);

  const pricing = product.pricing_by_duration ?? {};

  // Duration chips — only durations with a real price
  const previewChips = DURATION_OPTIONS.filter((d) => (pricing[d.key] ?? 0) > 0);

  // Which duration's price to show. Driven by the catalog's duration filter
  // (`displayDuration`); defaults to 12 months, falling back to the cheapest
  // available duration if this product has no 12-month price.
  const fallbackDuration =
    (pricing["12_months"] ?? 0) > 0
      ? "12_months"
      : previewChips[0]?.key || "12_months";
  const selectedDuration =
    displayDuration && (pricing[displayDuration] ?? 0) > 0
      ? displayDuration
      : fallbackDuration;

  const disc = (key) => discountedRent(pricing[key], product.percent_discount);
  const currentPrice = disc(selectedDuration);
  const currentPriceList = pricing[selectedDuration];

  // Human-readable label for the duration currently being priced.
  const selectedDurationLabel =
    DURATION_OPTIONS.find((d) => d.key === selectedDuration)?.label ?? null;

  // Pricing ladder for hover tooltip — only available durations
  const pricingLadder = previewChips.map((d) => ({
    label: d.label,
    price: disc(d.key),
    suffix: "/mo",
  }));

  return (
    // A real anchor, not a click-handler on a div: that is what lets the browser
    // open the product in a new tab, and it makes the card keyboard-focusable
    // and legible to screen readers.
    <motion.a
      ref={ref}
      href={productUrl(product.id)}
      target="_blank"
      rel="noopener noreferrer"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      className="group bg-card border border-border/50 rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 cursor-pointer flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      onMouseEnter={() => setShowPricingLadder(true)}
      onMouseLeave={() => setShowPricingLadder(false)}
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-white overflow-hidden shrink-0 border-b border-border/20">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover p-0 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist button */}
        <button
          type="button"
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            // Nested inside the card's anchor — must also preventDefault, or
            // toggling the wishlist would navigate to the product.
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 p-1 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 focus-visible:outline-none"
        >
          <Heart
            className={`w-6 h-6 transition-colors filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] ${
              isFavorite ? "fill-primary text-primary" : "text-white"
            }`}
          />
        </button>

        {/* Hover Pricing Ladder */}
        <AnimatePresence>
          {showPricingLadder && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent p-4 pt-8 hidden md:block"
            >
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${pricingLadder.length}, minmax(0, 1fr))`,
                }}
              >
                {pricingLadder.map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-[10px] text-white/70 mb-0.5">
                      {item.label}
                    </div>
                    <div className="text-xs text-white font-semibold">
                      ₹{item.price.toLocaleString("en-IN")}
                      <span className="text-[9px] font-normal">
                        {item.suffix}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Content (Left-aligned & serif-styled) */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2.5 text-left">
        <div className="flex flex-col gap-1">
          {/* Category Tag */}
          <span className="font-sans text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest leading-none">
            {product.subcategory || product.category || "Rental"}
          </span>
          
          {/* Title */}
          <h3 className="font-display font-semibold text-sm md:text-base text-foreground leading-snug line-clamp-1 mt-0.5">
            {product.name}
          </h3>
        </div>

        {/* Pricing Preview */}
        <div className="flex items-baseline gap-1.5 flex-wrap leading-none">
          <span className="text-base md:text-lg font-bold text-primary">
            ₹{currentPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] text-muted-foreground font-sans">/mo</span>
          {currentPriceList > currentPrice && (
            <span className="text-[10px] text-muted-foreground line-through font-sans ml-1">
              ₹{currentPriceList.toLocaleString("en-IN")}
            </span>
          )}
          {currentPriceList > currentPrice && (
            <span className="text-[10px] font-semibold text-success bg-success-muted px-1.5 py-0.5 rounded-full font-sans ml-auto">
              {product.percent_discount}% OFF
            </span>
          )}
        </div>
      </div>
    </motion.a>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;

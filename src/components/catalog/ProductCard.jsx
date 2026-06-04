import { forwardRef, useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Badge style per tag type
const TAG_STYLES = {
  "Bestseller":      "bg-amber-100 text-amber-800 border border-amber-200",
  "Family pick":     "bg-teal-100 text-teal-700 border border-teal-200",
  "New arrival":     "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "Event-ready":     "bg-violet-100 text-violet-700 border border-violet-200",
  "Complete setups": "bg-blue-100 text-blue-700 border border-blue-200",
  "Flexible plans":  "bg-sky-100 text-sky-700 border border-sky-200",
};
const DEFAULT_TAG_STYLE = "bg-primary/10 text-primary border border-primary/20";

const ProductCard = forwardRef(({ product }, ref) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const pricing = product.pricing_by_duration;
  const monthlyPrice = pricing?.["12_months"];
  const tags = product.tags ?? [];

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      data-testid="product-card"
      className="group bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated hover:border-primary/25 transition-all duration-200 cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] bg-cream overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges — top-left, stacked */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm ${
                TAG_STYLES[tag] ?? DEFAULT_TAG_STYLE
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Favourite — 44×44 touch target */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2 right-2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 active:scale-95 transition-all duration-150"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              isFavorite ? "fill-rose-500 text-rose-500" : "text-muted-foreground"
            }`}
          />
        </button>
      </div>

      {/* Card content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="font-semibold text-sm md:text-base text-foreground leading-snug mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-1">
          {product.short_description}
        </p>

        {/* Price — 12-month plan only */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-xl font-bold text-primary">
            ₹{monthlyPrice?.toLocaleString("en-IN") ?? "—"}
          </span>
          <span className="text-sm text-muted-foreground font-medium">/mo</span>
          <span className="text-xs text-muted-foreground/60 ml-0.5">· 12-month plan</span>
        </div>

        {/* CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product.id}`);
          }}
          className="w-full btn-outline text-sm py-2.5 hover:bg-primary hover:text-primary-foreground active:scale-[0.98] transition-all duration-200"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;

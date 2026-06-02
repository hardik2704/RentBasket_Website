import { forwardRef, useState } from "react";
import { Star, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DURATION_OPTIONS } from "@/data/products";
import { discountedRent } from "@/lib/pricing";
import ProductImage from "@/components/ui/ProductImage";

const ProductCard = forwardRef(({ product }, ref) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPricingLadder, setShowPricingLadder] = useState(false);
  const navigate = useNavigate();

  // Duration chips — the monthly plans on offer
  const previewChips = DURATION_OPTIONS.filter(
    (d) => product.pricing_by_duration?.[d.key] !== undefined
  );

  const defaultDuration = product.pricing_by_duration?.["12_months"] !== undefined
    ? "12_months"
    : (previewChips[0]?.key || "12_months");
  const [selectedDuration, setSelectedDuration] = useState(defaultDuration);

  const pricing = product.pricing_by_duration;
  const disc = (key) => discountedRent(pricing[key], product.percent_discount);
  const startMonthly = disc("1_month"); // discounted price the customer actually pays
  const startMonthlyList = pricing["1_month"]; // pre-discount, shown struck-through
  const currentPrice = disc(selectedDuration);
  const currentPriceList = pricing[selectedDuration];

  // Pricing ladder for hover tooltip (discounted prices)
  const pricingLadder = [
    { label: "1 Month", price: disc("1_month"), suffix: "/mo" },
    { label: "3 Months", price: disc("3_months"), suffix: "/mo" },
    { label: "6 Months", price: disc("6_months"), suffix: "/mo" },
    { label: "12 Months", price: disc("12_months"), suffix: "/mo" },
  ];

  const primaryTag = product.tags?.[0];

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      className="group bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-shadow duration-200 cursor-pointer"
      onMouseEnter={() => setShowPricingLadder(true)}
      onMouseLeave={() => setShowPricingLadder(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-white overflow-hidden">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge */}
        {primaryTag && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] md:text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {primaryTag}
          </span>
        )}

        {/* Favorite Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite
                ? "fill-primary text-primary"
                : "text-muted-foreground"
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
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 pt-8 hidden md:block"
            >
              <div className="grid grid-cols-4 gap-1">
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

      {/* Card Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-sm md:text-base text-foreground leading-snug mb-1 line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-2.5 line-clamp-1">
          {product.short_description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-gold text-gold"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {product.rating}
          </span>
        </div>

        {/* Pricing Preview */}
        <div className="bg-secondary/60 rounded-xl p-3 mb-3">
          <div className="flex items-baseline justify-end gap-x-2 flex-wrap">
            {currentPriceList > currentPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{currentPriceList.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-lg md:text-xl font-bold text-primary">
              ₹{currentPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-muted-foreground">/month</span>
          </div>
        </div>

        {/* Duration Chips */}
        <div
          className="flex gap-1.5 mb-1 overflow-x-auto relative z-10"
          style={{ scrollbarWidth: "none" }}
        >
          {previewChips.map((d) => {
            const isSelected = d.key === selectedDuration;
            return (
              <button
                key={d.key}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDuration(d.key);
                }}
                className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 transition-all ${
                  isSelected
                    ? "bg-primary/5 border-primary/20 text-primary font-semibold"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {d.short}
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="max-h-0 opacity-0 overflow-hidden pointer-events-none group-hover:max-h-14 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 ease-out mt-0 group-hover:mt-3">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="w-full btn-outline text-sm py-2.5 hover:bg-primary hover:text-primary-foreground"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;

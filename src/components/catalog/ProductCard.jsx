import { useState } from "react";
import { Star, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DURATION_OPTIONS } from "@/data/products";

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPricingLadder, setShowPricingLadder] = useState(false);
  const navigate = useNavigate();

  const pricing = product.pricing_by_duration;
  const lowestDaily = pricing["1_day"];
  const lowestMonthly = pricing["12_months"];

  // Duration chip preview (show 5 key durations)
  const previewDurations = ["1_day", "1_month", "3_months", "6_months", "12_months"];
  const previewChips = DURATION_OPTIONS.filter((d) =>
    previewDurations.includes(d.key)
  );

  // Pricing ladder for hover tooltip
  const pricingLadder = [
    { label: "1 Day", price: pricing["1_day"], suffix: "" },
    { label: "7 Days", price: pricing["7_days"], suffix: "" },
    { label: "1 Month", price: pricing["1_month"], suffix: "/mo" },
    { label: "6 Months", price: pricing["6_months"], suffix: "/mo" },
    { label: "12 Months", price: pricing["12_months"], suffix: "/mo" },
  ];

  const primaryTag = product.tags?.[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="group bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300"
      onMouseEnter={() => setShowPricingLadder(true)}
      onMouseLeave={() => setShowPricingLadder(false)}
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <img
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
              <div className="grid grid-cols-5 gap-1">
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
          <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-medium">
            Price varies by duration
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-lg md:text-xl font-bold text-primary">
              ₹{lowestDaily.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-muted-foreground">/day</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            or ₹{lowestMonthly.toLocaleString("en-IN")}/month (12M plan)
          </p>
        </div>

        {/* Duration Chips */}
        <div
          className="flex gap-1.5 mb-4 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {previewChips.map((d) => (
            <span
              key={d.key}
              className="text-[10px] md:text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground whitespace-nowrap flex-shrink-0"
            >
              {d.short}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate(`/product/${product.id}`)}
          className="w-full btn-outline text-sm py-2.5 hover:bg-primary hover:text-primary-foreground"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;

import { DURATION_OPTIONS } from "@/data/products";
import { discountedRent } from "@/lib/pricing";

const StickyMobileCTA = ({ product, selectedDuration, onAddToCart }) => {
  const pricing = product.pricing_by_duration;
  const price = discountedRent(pricing[selectedDuration] || 0, product.percent_discount);
  const isMonthly = ["1_month", "3_months", "6_months", "11_months", "12_months", "24_months", "36_months"].includes(
    selectedDuration,
  );
  const durationLabel = DURATION_OPTIONS.find((d) => d.key === selectedDuration)?.label || "";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border shadow-elevated">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        {/* Price + Duration */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-primary">
              ₹{price.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-muted-foreground">
              {isMonthly ? "/mo" : ""}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground truncate">
            {durationLabel} · Deposit ₹{product.deposit?.toLocaleString("en-IN")}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onAddToCart}
          className="btn-gradient-coral px-6 py-2.5 text-sm font-semibold whitespace-nowrap flex-shrink-0"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default StickyMobileCTA;

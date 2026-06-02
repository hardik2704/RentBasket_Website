import { Clock } from "lucide-react";
import { toast } from "sonner";
import { DURATION_OPTIONS, DURATION_BADGES, MONTHLY_DURATION_KEYS } from "@/data/products";
import { discountedRent } from "@/lib/pricing";

const DurationSelector = ({ product, selectedDuration, onDurationChange }) => {
  const pricing = product.pricing_by_duration ?? {};
  const isMonthly = (key) => MONTHLY_DURATION_KEYS.includes(key);

  const formatPrice = (key) => {
    const listRent = pricing[key];
    if (!listRent) return "—";
    const price = discountedRent(listRent, product.percent_discount);
    if (isMonthly(key)) {
      return `₹${price.toLocaleString("en-IN")}/mo`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const availableOptions = DURATION_OPTIONS.filter((d) => (pricing[d.key] ?? 0) > 0);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-soft">
      <h3 className="text-lg font-bold mb-1.5">Choose Rental Duration</h3>
      <p className="text-sm text-muted-foreground mb-5">
        Longer durations give better monthly value
      </p>

      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-2.5">
        {availableOptions.map((d) => {
          const isSelected = selectedDuration === d.key;
          const badge = DURATION_BADGES[d.key];

          return (
            <button
              key={d.key}
              onClick={() => onDurationChange(d.key)}
              className={`relative flex flex-col items-center justify-center px-2 py-3 md:py-3.5 rounded-xl border-2 transition-all duration-200 text-center ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-soft"
                  : "border-border hover:border-primary/40 bg-background"
              }`}
            >
              {/* Badge */}
              {badge && (
                <span
                  className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    badge === "Best Value"
                      ? "bg-primary text-primary-foreground"
                      : badge === "Most Popular"
                      ? "bg-gold text-white"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {badge}
                </span>
              )}

              <span
                className={`text-xs md:text-sm font-semibold mb-0.5 ${
                  isSelected ? "text-primary" : "text-foreground"
                }`}
              >
                {d.label}
              </span>
              <span
                className={`text-[11px] md:text-xs font-medium ${
                  isSelected ? "text-primary/80" : "text-muted-foreground"
                }`}
              >
                {formatPrice(d.key)}
              </span>
            </button>
          );
        })}
      </div>

      {/* RentBasket Mini cross-link — short-term (sub-month) rentals, coming soon */}
      <button
        type="button"
        onClick={() =>
          toast("RentBasket Mini is coming soon", {
            description: "Short-term rentals (under a month) will live here.",
          })
        }
        className="mt-4 w-full flex items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-secondary/30 px-4 py-3 text-left transition-colors hover:bg-secondary/50"
      >
        <span className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span>
            <span className="block text-sm font-semibold text-foreground">
              Need it for less than a month?
            </span>
            <span className="block text-xs text-muted-foreground">
              Short-term rentals on RentBasket Mini
            </span>
          </span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-1 rounded-full whitespace-nowrap">
          Coming soon
        </span>
      </button>
    </div>
  );
};

export default DurationSelector;

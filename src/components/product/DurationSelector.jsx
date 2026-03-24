import { DURATION_OPTIONS, DURATION_BADGES } from "@/data/products";

const DurationSelector = ({ product, selectedDuration, onDurationChange }) => {
  const pricing = product.pricing_by_duration;
  const isMonthly = (key) => ["1_month", "3_months", "6_months", "9_months", "12_months"].includes(key);

  const formatPrice = (key) => {
    const price = pricing[key];
    if (isMonthly(key)) {
      return `₹${price.toLocaleString("en-IN")}/mo`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-soft">
      <h3 className="text-lg font-bold mb-1.5">Choose Rental Duration</h3>
      <p className="text-sm text-muted-foreground mb-5">
        Longer durations give better monthly value
      </p>

      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-2.5">
        {DURATION_OPTIONS.map((d) => {
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
                      : "bg-green-500 text-white"
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
    </div>
  );
};

export default DurationSelector;

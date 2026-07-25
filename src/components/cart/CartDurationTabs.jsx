import { Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { DURATION_OPTIONS } from "@/data/products";

const labelFor = (key) =>
  DURATION_OPTIONS.find((d) => d.key === key)?.label || key;

/**
 * Duration switcher for the cart. The cart is split into one group per rental
 * duration; this control selects which group is shown (and, in turn, which
 * group the order summary / checkout act on).
 *
 * Rendered as a segmented pill row rather than a dropdown: there are only a
 * handful of durations, so showing them all — with item counts — lets the user
 * see every plan and the active one at a glance, and makes "you have N plans,
 * checkout one at a time" obvious from the shape alone. Hidden entirely when the
 * cart has a single duration group (nothing to switch between).
 */
const CartDurationTabs = () => {
  const { durationsInCart, selectedDuration, setSelectedDuration, groupCount } =
    useCart();

  if (durationsInCart.length <= 1) return null;

  return (
    <div className="mb-5 rounded-2xl border border-border bg-card p-4 md:p-5 shadow-soft">
      {/* Intro line — the single source of the "split into plans" message */}
      <div className="flex items-start gap-2.5 mb-3.5">
        <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
          <Clock className="w-4 h-4 text-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground leading-tight">
            {durationsInCart.length} rental plans in your basket
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
            Each plan checks out as a separate order.
          </p>
        </div>
      </div>

      {/* Segmented plan selector */}
      <div
        role="tablist"
        aria-label="Rental plans"
        className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 py-0.5 snap-x"
      >
        {durationsInCart.map((key) => {
          const count = groupCount(key);
          const isSelected = key === selectedDuration;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedDuration(key)}
              className={`group flex flex-shrink-0 snap-start items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                isSelected
                  ? "border-foreground bg-foreground/5 shadow-sm"
                  : "border-border bg-background hover:border-foreground/35 hover:bg-secondary/30"
              }`}
            >
              <span
                className={`text-sm font-bold ${
                  isSelected ? "text-foreground" : "text-foreground"
                }`}
              >
                {labelFor(key)}
              </span>
              <span
                className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[11px] font-bold ${
                  isSelected
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CartDurationTabs;

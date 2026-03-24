import { DURATION_OPTIONS } from "@/data/products";
import { CheckCircle } from "lucide-react";

const PricingSummary = ({ product, selectedDuration, quantity }) => {
  const pricing = product.pricing_by_duration;
  const price = pricing[selectedDuration] || 0;
  const deposit = product.deposit || 0;
  const isMonthly = ["1_month", "3_months", "6_months", "9_months", "12_months"].includes(selectedDuration);

  const durationLabel =
    DURATION_OPTIONS.find((d) => d.key === selectedDuration)?.label || "";

  const rent = price * quantity;
  const totalDueToday = rent + deposit;

  return (
    <div className="bg-card border-2 border-primary/20 rounded-2xl p-5 md:p-6 shadow-soft">
      <h3 className="text-base font-bold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary" />
        Pricing Summary
      </h3>

      <div className="space-y-3">
        {/* Selected Plan */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Selected Plan</span>
          <span className="text-sm font-semibold text-foreground">
            {durationLabel}
          </span>
        </div>

        {/* Rent */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Rent {quantity > 1 ? `(×${quantity})` : ""}
          </span>
          <span className="text-sm font-semibold text-foreground">
            ₹{rent.toLocaleString("en-IN")}
            {isMonthly ? "/month" : ""}
          </span>
        </div>

        {/* Deposit */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Security Deposit
          </span>
          <span className="text-sm font-medium text-foreground">
            ₹{deposit.toLocaleString("en-IN")}
            <span className="text-xs text-green-600 ml-1">refundable</span>
          </span>
        </div>

        {/* Free items */}
        <div className="border-t border-border/50 pt-3 space-y-2">
          {["Delivery", "Installation", "Maintenance"].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{item}</span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                <CheckCircle className="w-3.5 h-3.5" />
                Free
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t-2 border-primary/20 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-foreground">
              Total Due Today
            </span>
            <span className="text-xl md:text-2xl font-bold text-primary">
              ₹{totalDueToday.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground mt-1.5 text-right">
            {isMonthly
              ? `₹${rent.toLocaleString("en-IN")}/mo rent + ₹${deposit.toLocaleString("en-IN")} deposit`
              : `₹${rent.toLocaleString("en-IN")} rent + ₹${deposit.toLocaleString("en-IN")} deposit`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingSummary;

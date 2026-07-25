import { DURATION_OPTIONS } from "@/data/products";
import { cartBreakdown } from "@/lib/pricing";
import { CheckCircle } from "lucide-react";

const PricingSummary = ({ product, selectedDuration, quantity }) => {
  const pricing = product.pricing_by_duration;
  const isMonthly = ["3_months", "6_months", "9_months", "12_months"].includes(selectedDuration);

  const durationLabel =
    DURATION_OPTIONS.find((d) => d.key === selectedDuration)?.label || "";

  // Build a single-item breakdown mimicking the full cart pricing flow
  const b = cartBreakdown([
    {
      rent: pricing[selectedDuration] || 0,
      percent_discount: product.percent_discount || 0,
      security_multiple: product.security_multiple,
      adv_security: product.adv_security,
      quantity,
    },
  ]);

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 md:p-6 shadow-soft">
      <h3 className="text-base font-bold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-foreground/80" />
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

        {/* Base Monthly Rent */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Base Rent {quantity > 1 ? `(×${quantity})` : ""}
          </span>
          <span className="text-sm font-semibold text-foreground">
            ₹{b.baseRent.toLocaleString("en-IN")}
            {isMonthly ? "/mo" : ""}
          </span>
        </div>

        {/* GST (18%) */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">GST (18%)</span>
          <span className="text-sm font-semibold text-foreground">
            ₹{b.gst.toLocaleString("en-IN")}
            {isMonthly ? "/mo" : ""}
          </span>
        </div>

        {/* Net Monthly Rent */}
        <div className="flex items-center justify-between font-bold text-foreground">
          <span className="text-sm">Net Monthly Rent</span>
          <span className="text-sm">
            ₹{b.netMonthlyRent.toLocaleString("en-IN")}
            {isMonthly ? "/mo" : ""}
          </span>
        </div>

        {/* Free items */}
        <div className="border-t border-border/50 pt-3 space-y-2">
          {["Delivery & Installation", "Maintenance & Support"].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{item}</span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-success">
                <CheckCircle className="w-3.5 h-3.5" />
                Free
              </span>
            </div>
          ))}
        </div>

        {/* Total (First Month) */}
        <div className="border-t border-border pt-4 mt-4 bg-secondary/10 -mx-5 px-5 pb-2 rounded-b-xl">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-base font-bold text-foreground">
              Total (First Month)
            </span>
            <span className="text-xl md:text-2xl font-black text-foreground tracking-tight">
              ₹{b.netMonthlyRent.toLocaleString("en-IN")}
              {isMonthly ? "/mo" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSummary;

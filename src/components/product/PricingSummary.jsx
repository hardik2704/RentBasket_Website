import { DURATION_OPTIONS } from "@/data/products";
import { cartBreakdown } from "@/lib/pricing";
import { CheckCircle, ShieldCheck } from "lucide-react";

const PricingSummary = ({ product, selectedDuration, quantity }) => {
  const pricing = product.pricing_by_duration;
  const isMonthly = ["1_month", "3_months", "6_months", "11_months", "12_months", "24_months", "36_months"].includes(
    selectedDuration,
  );

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

        {/* Deposit */}
        <div className="flex items-center justify-between border-t border-border/30 pt-2">
          <span className="text-sm text-muted-foreground font-medium flex items-center gap-1">
            Refundable Security
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
          </span>
          <span className="text-sm font-bold text-foreground">
            ₹{b.security.toLocaleString("en-IN")}
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
        <div className="border-t-2 border-primary/20 pt-4 mt-4 bg-primary/[0.01] -mx-5 px-5 pb-2 rounded-b-xl">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-base font-bold text-foreground">
              Total (First Month)
            </span>
            <span className="text-xl md:text-2xl font-black text-primary tracking-tight">
              ₹{b.netFirstMonth.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground mt-2 leading-relaxed">
            Pay <strong className="text-foreground">₹{b.upfront.toLocaleString("en-IN")}</strong> now (50%) to book, and <strong className="text-foreground">₹{b.payOnDelivery.toLocaleString("en-IN")}</strong> on delivery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingSummary;

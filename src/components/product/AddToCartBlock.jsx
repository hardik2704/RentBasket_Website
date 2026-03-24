import { useState } from "react";
import { Minus, Plus, Calendar, ShieldCheck, Clock, ArrowRightLeft, Headphones } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { DURATION_OPTIONS } from "@/data/products";
import { toast } from "sonner";

const AddToCartBlock = ({ product, selectedDuration, quantity, onQuantityChange }) => {
  const [startDate, setStartDate] = useState("");
  const { addToCart } = useCart();

  const pricing = product.pricing_by_duration;
  const price = pricing[selectedDuration] || 0;
  const durationLabel = DURATION_OPTIONS.find((d) => d.key === selectedDuration)?.label || "";

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      duration: selectedDuration,
      durationLabel,
      price,
      quantity,
      startDate: startDate || new Date().toISOString().split("T")[0],
      deposit: product.deposit,
      image: product.image,
      category: product.category,
    });
    toast.success(`${product.name} added to cart`, {
      description: `${durationLabel} plan · ₹${price.toLocaleString("en-IN")}`,
    });
  };

  const trustPoints = [
    { icon: ShieldCheck, label: "No ownership hassle" },
    { icon: Headphones, label: "Support included" },
    { icon: Clock, label: "Flexible durations" },
    { icon: ArrowRightLeft, label: "Relocation available" },
  ];

  // Get tomorrow's date as minimum start date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="space-y-4">
      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Quantity */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Qty</span>
          <div className="flex items-center border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center text-sm font-semibold">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(Math.min(10, quantity + 1))}
              className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Start Date */}
        <div className="flex items-center gap-3 flex-1">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Start
          </span>
          <div className="relative flex-1">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={minDate}
              className="w-full pl-9 pr-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
            />
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={handleAddToCart}
          className="btn-primary w-full py-3.5 text-base font-semibold"
          style={{
            background: "linear-gradient(89.03deg, #D72F26 -14.8%, #EF1040 50.11%, #FECC87 129.44%)",
          }}
        >
          Add to Cart
        </button>
        <a
          href="https://www.rentbasket.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline w-full py-3 text-sm text-center"
        >
          Get Home Setup Quote
        </a>
      </div>

      {/* Micro Trust Points */}
      <div className="grid grid-cols-2 gap-2.5">
        {trustPoints.map((tp, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground"
          >
            <tp.icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            {tp.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddToCartBlock;

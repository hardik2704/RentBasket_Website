import { Minus, Plus, ShieldCheck, Clock, ArrowRightLeft, Headphones } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { DURATION_OPTIONS } from "@/data/products";
import { discountedRent } from "@/lib/pricing";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AddToCartBlock = ({ product, selectedDuration, quantity, onQuantityChange }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const pricing = product.pricing_by_duration;
  const price = discountedRent(pricing[selectedDuration] || 0, product.percent_discount);
  const durationLabel = DURATION_OPTIONS.find((d) => d.key === selectedDuration)?.label || "";

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      duration: selectedDuration,
      durationLabel,
      price,
      quantity,
      startDate: new Date().toISOString().split("T")[0],
      adv_security: product.adv_security,
      image: product.image,
      category: product.category,
      rent: product.pricing_by_duration[selectedDuration],
      percent_discount: product.percent_discount,
      security_multiple: product.security_multiple,
    });
    toast.success(`${product.name} added to cart`, {
      description: `${durationLabel} plan · ₹${price.toLocaleString("en-IN")}`,
    });
    navigate("/cart");
  };

  const trustPoints = [
    { icon: ShieldCheck, label: "No ownership hassle" },
    { icon: Headphones, label: "Support included" },
    { icon: Clock, label: "Flexible durations" },
    { icon: ArrowRightLeft, label: "Relocation available" },
  ];
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
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={handleAddToCart}
          className="btn-gradient-coral w-full py-3.5 text-base font-semibold"
        >
          Add to Cart
        </button>
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

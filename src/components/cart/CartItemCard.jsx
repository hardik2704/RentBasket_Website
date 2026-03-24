import { Minus, Plus, Trash2, ChevronDown, CheckCircle, Calendar, Bookmark, Star, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { DURATION_OPTIONS, getProductById } from "@/data/products";
import { Link } from "react-router-dom";

const MONTHLY_KEYS = new Set(["1_month", "3_months", "6_months", "9_months", "12_months"]);
const NEW_PRODUCT_SURCHARGE = 65;

const CartItemCard = ({ item }) => {
  const { updateItem, removeFromCart } = useCart();
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const pickerRef = useRef(null);

  const product = getProductById(item.productId);
  const isMonthly = MONTHLY_KEYS.has(item.duration);

  // Close duration picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowDurationPicker(false);
      }
    };
    if (showDurationPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDurationPicker]);

  const handleDurationChange = (newDurationKey) => {
    if (!product) return;
    const basePrice = product.pricing_by_duration[newDurationKey];
    const finalPrice = item.isBrandNew ? basePrice + NEW_PRODUCT_SURCHARGE : basePrice;
    const newDeposit = item.isRecommendation ? 0 : product.deposit;
    const newLabel = DURATION_OPTIONS.find((d) => d.key === newDurationKey)?.label || "";
    updateItem(item.cartItemId, {
      duration: newDurationKey,
      durationLabel: newLabel,
      price: finalPrice,
      deposit: newDeposit,
    });
    setShowDurationPicker(false);
  };

  const handleQuantityChange = (delta) => {
    const newQty = Math.max(1, Math.min(10, item.quantity + delta));
    updateItem(item.cartItemId, { quantity: newQty });
  };

  // Resolve image: use product data as source of truth (handles Vite imports)
  const resolvedImage = product?.image || item.image;
  const lineTotal = item.price * item.quantity + item.deposit;
  const rentOnly = item.price * item.quantity;

  // Calculate savings vs 1-day pricing
  const savings = product && item.duration !== "1_day"
    ? (product.pricing_by_duration["1_day"] * item.quantity) - rentOnly
    : 0;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-shadow">
      {/* Compact savings banner */}
      {savings > 0 && (
        <div className="bg-green-50 border-b border-green-100 px-4 py-1.5 flex items-center gap-1.5">
          <span className="text-[10px] md:text-xs text-green-700 font-medium">
            You save ₹{savings.toLocaleString("en-IN")} vs daily pricing
          </span>
        </div>
      )}

      <div className="p-4 md:p-5">
        {/* ── MOBILE LAYOUT ── */}
        <div className="md:hidden">
          <div className="flex gap-3 mb-3">
            {/* Thumbnail */}
            <Link
              to={`/product/${item.productId}`}
              className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-border/50 block"
            >
              <img
                src={resolvedImage}
                alt={item.name}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <Link
                to={`/product/${item.productId}`}
                className="text-sm font-semibold text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors block"
              >
                {item.name}
              </Link>
              <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
              {product && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] text-muted-foreground">{product.rating}</span>
                </div>
              )}
            </div>

            {/* Remove */}
            <button
              onClick={() => removeFromCart(item.cartItemId)}
              className="self-start p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Controls Row */}
          <div className="flex items-center gap-2 mb-3" ref={pickerRef}>
            {/* Duration Picker */}
            <div className="relative flex-1">
              <button
                onClick={() => setShowDurationPicker(!showDurationPicker)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-sm font-medium bg-background transition-colors ${
                  showDurationPicker ? "border-primary ring-2 ring-primary/10" : "border-border"
                }`}
              >
                <span>{item.durationLabel || "1 Month"}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDurationPicker ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Quantity */}
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-secondary disabled:opacity-30"
                disabled={item.quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center text-sm font-semibold select-none">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-secondary disabled:opacity-30"
                disabled={item.quantity >= 10}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-secondary/40 rounded-xl px-3 py-2.5 space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-muted-foreground">Rent</span>
              <span>₹{item.price.toLocaleString("en-IN")}{isMonthly ? "/mo" : ""} × {item.quantity}</span>
            </div>
            {item.isBrandNew && (
              <div className="flex justify-between text-[10px] text-primary/80 italic font-medium">
                <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3"/> Brand New Upgrade</span>
                <span>+₹{NEW_PRODUCT_SURCHARGE.toLocaleString("en-IN")}/mo</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Deposit</span>
              <span className="font-medium">₹{item.deposit.toLocaleString("en-IN")} <span className="text-green-600 text-[10px]">refundable</span></span>
            </div>
            <div className="flex justify-between text-xs text-green-600">
              <span>Delivery + Install + Maintenance</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex justify-between text-sm pt-1.5 border-t border-border/50">
              <span className="font-bold">Total</span>
              <span className="font-bold text-primary">₹{lineTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden md:flex gap-5">
          {/* Thumbnail */}
          <Link
            to={`/product/${item.productId}`}
            className="w-28 h-28 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-border/50 block hover:border-primary/30 transition-colors"
          >
            <img
              src={resolvedImage}
              alt={item.name}
              className="w-full h-full object-contain p-3"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </Link>

          {/* Center Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div>
                <Link
                  to={`/product/${item.productId}`}
                  className="text-base font-semibold text-foreground leading-snug hover:text-primary transition-colors block"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>{item.category}</span>
                  {product && (
                    <span className="inline-flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {product.rating} ({product.review_count})
                    </span>
                  )}
                  {item.startDate && (
                    <span className="inline-flex items-center gap-0.5">
                      <Calendar className="w-3 h-3" />
                      Starts {new Date(item.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center gap-4 mt-3" ref={pickerRef}>
              {/* Duration Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowDurationPicker(!showDurationPicker)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium bg-background transition-all ${
                    showDurationPicker ? "border-primary ring-2 ring-primary/10" : "border-border hover:border-primary/40"
                  }`}
                >
                  <span>{item.durationLabel || "1 Month"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDurationPicker ? "rotate-180" : ""}`} />
                </button>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Qty</span>
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-30"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold select-none">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-30"
                    disabled={item.quantity >= 10}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="text-xs text-red-500 hover:text-red-600 hover:underline transition-colors font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Right Pricing */}
          <div className="w-48 flex-shrink-0 text-right space-y-1">
            <div className="text-lg font-bold text-foreground">
              ₹{rentOnly.toLocaleString("en-IN")}{isMonthly ? <span className="text-sm font-normal text-muted-foreground">/mo</span> : ""}
            </div>
            {item.isBrandNew && (
              <div className="text-[10px] text-primary font-semibold flex items-center justify-end gap-1">
                <Sparkles className="w-2.5 h-2.5 fill-primary" />
                Brand New Upgrade (+₹{NEW_PRODUCT_SURCHARGE}/mo)
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              + ₹{item.deposit.toLocaleString("en-IN")} deposit <span className="text-green-600">refundable</span>
            </div>
            <div className="flex items-center justify-end gap-1 text-[10px] text-green-600 mt-1">
              <CheckCircle className="w-3 h-3" />
              Free Delivery + Installation
            </div>
            <div className="pt-2 border-t border-border/50 mt-2">
              <span className="text-[10px] text-muted-foreground block mb-0.5">Due Today</span>
              <span className="text-xl font-bold text-primary">₹{lineTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Duration Picker Dropdown */}
        <AnimatePresence>
          {showDurationPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-2.5 font-medium">
                  Choose rental duration — longer plans save more
                </p>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1.5">
                  {product && DURATION_OPTIONS.map((d) => {
                    const dPrice = product.pricing_by_duration[d.key];
                    const isDM = MONTHLY_KEYS.has(d.key);
                    const isSelected = item.duration === d.key;
                    const is12m = d.key === "12_months";
                    return (
                      <button
                        key={d.key}
                        onClick={() => handleDurationChange(d.key)}
                        className={`relative flex flex-col items-center py-2.5 px-1.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                            : "border-border text-muted-foreground hover:border-primary/40 hover:bg-secondary/30"
                        }`}
                      >
                        {is12m && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                            Best Value
                          </span>
                        )}
                        <span className="text-xs font-semibold">{d.label}</span>
                        <span className="text-[10px] mt-0.5">₹{dPrice?.toLocaleString("en-IN")}{isDM ? "/mo" : ""}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CartItemCard;

import { useState, useMemo } from "react";
import { Plus, PackagePlus, CheckSquare, Square, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { DURATION_OPTIONS, getRelatedProducts } from "@/data/products";
import products from "@/data/products";
import { toast } from "sonner";

const COMBO_SURCHARGE = 50; // ₹50/mo per product when "Need all" is checked

const CrossSellStrip = () => {
  const { cartItems, addToCart } = useCart();
  const [needAll, setNeedAll] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 1. Build a pool of suggestions based on cart contents
  const allSuggestions = useMemo(() => {
    const cartProductIds = cartItems.map((i) => i.productId);
    
    // Get related products from all cart items
    let relatedIds = [];
    cartItems.forEach(item => {
      const related = products.find(p => p.id === item.productId)?.related_product_ids || [];
      relatedIds = [...relatedIds, ...related];
    });

    // Also get top rated products as fallback
    const topRated = [...products]
      .sort((a, b) => b.rating - a.rating)
      .map(p => p.id);

    // Combine, remove duplicates, and filter out items already in cart
    const poolIds = [...new Set([...relatedIds, ...topRated])]
      .filter(id => !cartProductIds.includes(id));

    return poolIds.map(id => products.find(p => p.id === id)).filter(Boolean);
  }, [cartItems]);

  // 2. Pick 4 items from the pool, cycling based on refreshKey
  const suggestions = useMemo(() => {
    if (allSuggestions.length === 0) return [];
    
    // We use a simple modulo logic to "page" through the pool
    const startIndex = (refreshKey * 4) % allSuggestions.length;
    
    // Fill up to 4 items, wrapping around if needed but usually just taking 4
    let selected = allSuggestions.slice(startIndex, startIndex + 4);
    
    // If we have fewer than 4 and more than 4 exist, wrap around
    if (selected.length < 4 && allSuggestions.length > 4) {
      selected = [...selected, ...allSuggestions.slice(0, 4 - selected.length)];
    }
    
    return selected;
  }, [allSuggestions, refreshKey]);

  if (suggestions.length === 0) return null;

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getDisplayPrice = (product) => {
    const base = product.pricing_by_duration["1_month"] ?? 0;
    return needAll ? base + COMBO_SURCHARGE : base;
  };

  const handleQuickAdd = (product) => {
    const defaultDuration = "1_month";
    const basePrice = product.pricing_by_duration[defaultDuration];
    const finalPrice = needAll ? basePrice + COMBO_SURCHARGE : basePrice;
    const label = DURATION_OPTIONS.find((d) => d.key === defaultDuration)?.label || "1 Month";

    addToCart({
      productId: product.id,
      name: product.name,
      duration: defaultDuration,
      durationLabel: label,
      price: finalPrice,
      quantity: 1,
      startDate: new Date().toISOString().split("T")[0],
      deposit: product.deposit,
      image: product.image,
      category: product.category,
      hasSurcharge: needAll, // Persist the opt-in surcharge status
    });

    toast.success(`${product.name} added to cart`, {
      description: needAll
        ? `${label} plan · ₹${finalPrice.toLocaleString("en-IN")}/mo (incl. ₹${COMBO_SURCHARGE} combo fee)`
        : `${label} plan · ₹${finalPrice.toLocaleString("en-IN")}/mo`,
    });
  };

  const handleAddAll = () => {
    const defaultDuration = "1_month";
    const label = DURATION_OPTIONS.find((d) => d.key === defaultDuration)?.label || "1 Month";

    suggestions.forEach((product) => {
      const basePrice = product.pricing_by_duration[defaultDuration];
      const finalPrice = basePrice + COMBO_SURCHARGE;
      addToCart({
        productId: product.id,
        name: product.name,
        duration: defaultDuration,
        durationLabel: label,
        price: finalPrice,
        quantity: 1,
        startDate: new Date().toISOString().split("T")[0],
        deposit: product.deposit,
        image: product.image,
        category: product.category,
      });
    });

    toast.success(`${suggestions.length} products added to cart!`, {
      description: `Combo plan · ₹${COMBO_SURCHARGE}/mo combo fee applied per product`,
    });
  };

  return (
    <section className="mt-8 md:mt-10">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-display font-bold text-foreground">
            Complete your home setup
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Recommendations for you — pick what you need
          </p>
        </div>
        {allSuggestions.length > 4 && (
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-full transition-colors group"
          >
            <RefreshCcw className="w-3.5 h-3.5 group-active:rotate-180 transition-transform duration-500" />
            Shuffle
          </button>
        )}
      </div>

      {/* "Need all?" checkbox bar */}
      <div className="flex items-center justify-between bg-secondary/50 border border-border rounded-2xl px-5 py-4 mb-5 shadow-sm">
        <label
          htmlFor="need-all-checkbox"
          className="flex items-center gap-4 cursor-pointer select-none flex-1"
        >
          <button
            id="need-all-checkbox"
            type="button"
            onClick={() => setNeedAll((v) => !v)}
            className="flex-shrink-0"
            aria-checked={needAll}
            role="checkbox"
          >
            {needAll ? (
              <CheckSquare className="w-6 h-6 text-primary" />
            ) : (
              <Square className="w-6 h-6 text-muted-foreground" />
            )}
          </button>
          <div className="pr-4">
            <p className="text-sm font-bold text-foreground">
              Add all 4 products together?
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Unlock the bundle convenience. ₹{COMBO_SURCHARGE}/mo fee applies per item for extra setup support.
            </p>
          </div>
        </label>
      </div>

      {/* Product cards - Grid instead of scroll */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {suggestions.map((product) => {
          const displayPrice = getDisplayPrice(product);
          const basePrice = product.pricing_by_duration["1_month"] ?? 0;

          return (
            <div
              key={product.id}
              className={`bg-card border rounded-2xl p-3.5 flex flex-col shadow-soft hover:shadow-card transition-all hover:-translate-y-1 ${
                needAll ? "border-primary/40 ring-1 ring-primary/20 bg-primary/[0.02]" : "border-border"
              }`}
            >
              {/* Thumbnail */}
              <Link
                to={`/product/${product.id}`}
                className="w-full aspect-square bg-gray-50/50 rounded-xl overflow-hidden mb-3 block group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </Link>

              {/* Name */}
              <Link to={`/product/${product.id}`} className="flex-1">
                <h4 className="text-[12px] font-bold text-foreground line-clamp-2 mb-1.5 hover:text-primary transition-colors leading-tight">
                  {product.name}
                </h4>
              </Link>

              {/* Price & Rating */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col">
                  <span className="text-[12px] font-extrabold text-primary">
                    ₹{displayPrice.toLocaleString("en-IN")}/mo
                  </span>
                  {needAll && (
                    <span className="text-[9px] text-muted-foreground line-through">
                      ₹{basePrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] font-bold text-amber-500">★</span>
                  <span className="text-[10px] font-semibold text-muted-foreground">{product.rating}</span>
                </div>
              </div>

              {/* Add button */}
              <button
                onClick={() => handleQuickAdd(product)}
                className="w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border-2 border-primary/20 text-primary text-[11px] font-bold hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CrossSellStrip;

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { DURATION_OPTIONS } from "@/data/products";
import { discountedRent } from "@/lib/pricing";
import { useProducts, useRecommendations } from "@/hooks/useProducts";
import { toast } from "sonner";

// From a group of enriched cart items, return the productId with the highest rent_12.
function anchorId(items) {
  return items.reduce((best, cur) => (cur.rent12 > best.rent12 ? cur : best), items[0]).productId;
}

// Derive winner and runner-up productIds from the cart.
// Groups by subcategory_id → picks the two largest groups →
// selects the highest-rent_12 item from each as the anchor.
function pickAnchors(cartItems, products) {
  if (cartItems.length === 0) return [null, null];

  const enriched = cartItems.map((item) => {
    const cat = products.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      // subcategory_id may be absent on cart items saved before this field was added
      subcategoryId: item.subcategory_id ?? cat?.subcategory_id ?? null,
      rent12: cat?.pricing_by_duration?.["12_months"] ?? 0,
    };
  }).filter((i) => i.subcategoryId !== null);

  if (enriched.length === 0) return [cartItems[0]?.productId ?? null, null];

  const groups = {};
  for (const item of enriched) {
    (groups[item.subcategoryId] ??= []).push(item);
  }

  // Sort: count desc → max rent_12 in group desc → subcategory_id asc (deterministic tie-break)
  const sorted = Object.entries(groups).sort(([aId, aItems], [bId, bItems]) => {
    if (bItems.length !== aItems.length) return bItems.length - aItems.length;
    const aMax = Math.max(...aItems.map((i) => i.rent12));
    const bMax = Math.max(...bItems.map((i) => i.rent12));
    if (bMax !== aMax) return bMax - aMax;
    return Number(aId) - Number(bId);
  });

  return [
    sorted[0] ? anchorId(sorted[0][1]) : null,
    sorted[1] ? anchorId(sorted[1][1]) : null,
  ];
}

const CrossSellStrip = () => {
  const { cartItems, addToCart, selectedDuration, durationsInCart } = useCart();
  const { data: products = [] } = useProducts();

  const [winnerProductId, runnerUpProductId] = useMemo(
    () => pickAnchors(cartItems, products),
    [cartItems, products]
  );

  const { data: winnerRecs = [], isLoading: loadingWinner } = useRecommendations(winnerProductId);
  const { data: runnerRecs = [], isLoading: loadingRunner } = useRecommendations(runnerUpProductId);

  const cartProductIds = useMemo(
    () => new Set(cartItems.map((i) => i.productId)),
    [cartItems]
  );

  // Highest monthly price among items currently in the cart.
  const maxCartPrice = useMemo(
    () => cartItems.reduce((max, i) => Math.max(max, i.price ?? 0), 0),
    [cartItems]
  );

  // Merge winner + runner-up, deduplicate, strip cart items, cap at 6.
  const suggestions = useMemo(() => {
    const seen = new Set();
    const merged = [];
    for (const item of [...winnerRecs, ...runnerRecs]) {
      if (!seen.has(item.id) && !cartProductIds.has(item.id)) {
        seen.add(item.id);
        merged.push(item);
      }
      if (merged.length >= 6) break;
    }
    return merged;
  }, [winnerRecs, runnerRecs, cartProductIds]);

  const isLoading = loadingWinner || (!!runnerUpProductId && loadingRunner);

  if (isLoading) {
    return (
      <section className="mt-8 md:mt-10">
        <div className="h-6 w-52 bg-secondary rounded animate-pulse mb-1" />
        <div className="h-4 w-36 bg-secondary rounded animate-pulse mb-5" />
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-[180px] shrink-0 bg-secondary rounded-2xl h-[260px] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (suggestions.length === 0) return null;

  const firstDuration = (product) =>
    DURATION_OPTIONS.find((d) => (product.pricing_by_duration?.[d.key] ?? 0) > 0)?.key ?? "3_months";

  // The duration a quick-added item should inherit: match what other products
  // in the cart belong to (the active duration group, or the first group
  // present), falling back to 12 months when the cart has no duration context.
  const targetDuration =
    selectedDuration || durationsInCart[0] || "12_months";

  // Pick the duration to add this product at: prefer the cart's target
  // duration, but only if the product actually offers pricing for it —
  // otherwise fall back to the product's first available duration so we
  // never add a line with no price.
  const resolveDuration = (product) =>
    (product.pricing_by_duration?.[targetDuration] ?? 0) > 0
      ? targetDuration
      : firstDuration(product);

  const handleQuickAdd = (product) => {
    if (product.stock_status === "out_of_stock") {
      toast.error(`${product.name} is out of stock`, {
        description: "This item isn't available to rent right now.",
      });
      return;
    }
    const defaultDuration = resolveDuration(product);
    const basePrice = discountedRent(product.pricing_by_duration[defaultDuration], product.percent_discount);
    const label = DURATION_OPTIONS.find((d) => d.key === defaultDuration)?.label || "3 Months";
    const depositWaived = basePrice < maxCartPrice;

    addToCart({
      stock_status: product.stock_status,
      productId: product.id,
      name: product.name,
      duration: defaultDuration,
      durationLabel: label,
      price: basePrice,
      quantity: 1,
      startDate: new Date().toISOString().split("T")[0],
      image: product.image,
      category: product.category,
      subcategory_id: product.subcategory_id,
      rent: product.pricing_by_duration[defaultDuration],
      percent_discount: product.percent_discount,
      // Real security stored always so CartContext can restore it when needed
      _realSecurityMultiple: product.security_multiple ?? null,
      _realAdvSecurity: product.adv_security ?? null,
      depositWaived,
      security_multiple: depositWaived ? 0 : (product.security_multiple ?? null),
      adv_security: depositWaived ? 0 : (product.adv_security ?? null),
      isRecommendation: true,
    });

    toast.success(`${product.name} added to basket`, {
      description: `${label} plan · ₹${basePrice.toLocaleString("en-IN")}/mo`,
    });
  };

  return (
    <section className="mt-8 md:mt-10">
      <div className="mb-4">
        <h3 className="text-lg md:text-xl font-display font-bold text-foreground">
          Complete your home setup
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">Recommendations for you</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar -mx-1 px-1">
        {suggestions.map((product) => {
          const displayPrice = discountedRent(
            product.pricing_by_duration[resolveDuration(product)] ?? 0,
            product.percent_discount
          );

          return (
            <div
              key={product.id}
              className="w-[180px] shrink-0 bg-card border border-border rounded-2xl p-3 flex flex-col shadow-soft hover:shadow-card transition-all hover:-translate-y-1"
            >
              <Link
                to={`/product/${product.id}`}
                className="w-full aspect-square bg-white rounded-xl overflow-hidden mb-3 block group border border-border/30 shadow-sm"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </Link>

              <Link to={`/product/${product.id}`} className="flex-1">
                <h4 className="text-[12px] font-bold text-foreground line-clamp-2 mb-1.5 hover:text-foreground transition-colors leading-tight">
                  {product.name}
                </h4>
              </Link>

              <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                <span className="text-[12px] font-extrabold text-foreground">
                  ₹{displayPrice.toLocaleString("en-IN")}/mo
                </span>
                {displayPrice < maxCartPrice && (
                  <span className="text-[10px] font-bold bg-success-muted text-success-muted-foreground border border-success-border px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    0 deposit
                  </span>
                )}
              </div>

              <button
                onClick={() => handleQuickAdd(product)}
                className="w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border border-border text-foreground bg-secondary text-[11px] font-bold hover:bg-foreground hover:text-background hover:border-foreground transition-all active:scale-95"
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

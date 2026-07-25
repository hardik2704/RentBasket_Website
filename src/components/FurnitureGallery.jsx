import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import ProductImage from "@/components/ui/ProductImage";
import { discountedRent } from "@/lib/pricing";

// Cheapest post-discount monthly rent across a product's available durations.
// Mirrors ProductCard's pricing (pricing_by_duration + percent_discount).
// Returns null if the product has no priced duration.
const getStartingPrice = (product) => {
  const pricing = product.pricing_by_duration ?? {};
  const prices = Object.values(pricing)
    .filter((v) => (v ?? 0) > 0)
    .map((v) => discountedRent(v, product.percent_discount));
  return prices.length ? Math.min(...prices) : null;
};

// Curated hero carousel — a fixed set of 8 real catalog products, pinned by their
// live amenity_type_id (the API is the source of truth, so the images, names and
// links stay in sync with the catalog instead of being hardcoded local assets).
// Order here is the order shown in the strip.
const FEATURED_PRODUCT_IDS = [
  "1054", // Premium Upholstered Queen Double Bed - Storage
  "36",   // Double Door Fridge
  "1036", // 6-Seater Sheesham Wood Dining Table (Cushioned)
  "13",   // Fully Automatic Washing Machine
  "41",   // Premium Revolving Chair
  "16",   // Microwave (Solo) 20 L
  "1041", // 7-Seater L-Shaped Sofa with Center Table & 2 Puffies - Green
  "15",   // Water Purifier
];

// Target number of cards in the strip — matches the curated list length.
const TARGET_CARD_COUNT = FEATURED_PRODUCT_IDS.length;

/** Square skeleton card shown per-slot while the catalog is loading. */
const GallerySkeleton = () => (
  <div className="flex gap-4 md:gap-6 overflow-hidden pb-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="shrink-0 w-[210px] md:w-[250px] h-[300px] md:h-[350px] rounded-2xl bg-secondary animate-pulse shadow-soft"
      />
    ))}
  </div>
);

// Continuous auto-scroll speed, in px/second.
const AUTO_SPEED = 40;

const FurnitureGallery = () => {
  const { data: products = [], isLoading } = useProducts();
  const [autoScroll, setAutoScroll] = useState(true);
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

  // Resolve the curated list to real products, then make it fail-safe.
  //
  // Hardik's 8 pinned products are ALWAYS shown first, in order, whenever they
  // exist in the catalog. The fallback below is purely a safety net for DB drift
  // (a SKU retired, re-seeded, or renumbered): any pinned ID that's missing would
  // otherwise leave the strip short — or empty if a bulk re-seed wipes all 8. So
  // we backfill only the *missing* slots with trending products (skipping any
  // already shown) to keep the strip full at 8. In the normal case where all 8
  // exist, the backfill contributes nothing and you see exactly Hardik's list.
  const items = useMemo(() => {
    const byId = new Map(products.map((p) => [String(p.id), p]));

    // 1. The curated picks that actually exist right now, in Hardik's order.
    const curated = FEATURED_PRODUCT_IDS
      .map((id) => byId.get(id))
      .filter(Boolean);

    if (curated.length >= TARGET_CARD_COUNT) return curated;

    // 2. Backfill only the missing slots from trending products (the API's
    //    is_trending flag), excluding anything already in the strip.
    const shown = new Set(curated.map((p) => String(p.id)));
    const backfill = products.filter(
      (p) => p.is_trending && !shown.has(String(p.id))
    );

    // 3. Last-resort widen: if there still aren't enough trending products,
    //    fall back to any remaining catalog product so the strip never goes
    //    empty (API up but no trending items flagged).
    if (curated.length + backfill.length < TARGET_CARD_COUNT) {
      const backfillIds = new Set(backfill.map((p) => String(p.id)));
      const rest = products.filter(
        (p) => !shown.has(String(p.id)) && !backfillIds.has(String(p.id))
      );
      backfill.push(...rest);
    }

    return [...curated, ...backfill].slice(0, TARGET_CARD_COUNT);
  }, [products]);

  // True circular strip: the item list is rendered twice back-to-back and
  // moved with a CSS transform (not scrollLeft). Because both halves are
  // pixel-identical, the offset can be wrapped with a modulo the instant it
  // passes one set's width — there's no "end" to reach and no reset to
  // disguise, so the motion never has a seam to hide. This still renders a
  // finite, fixed number of nodes (2x the list) rather than an unbounded/
  // infinitely-growing DOM.
  const loopItems = useMemo(
    () => (items.length > 0 ? [...items, ...items] : items),
    [items]
  );

  // Current transform offset, in px. A ref (not state) because it updates
  // every animation frame — putting it in state would re-render constantly.
  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);

  const applyOffset = () => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translateX(-${offsetRef.current}px)`;
  };

  // Measures one copy of the list (gap-inclusive) so the wrap point is exact.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;
    const cards = track.children;
    if (cards.length < items.length * 2) return;
    const first = cards[0];
    const firstOfSecondSet = cards[items.length];
    setWidthRef.current = firstOfSecondSet.offsetLeft - first.offsetLeft;
  }, [items, loopItems]);

  // Continuous rAF-driven scroll — no discrete jumps, so there's nothing to
  // visibly "snap." The offset wraps via modulo against one set's width,
  // which is invisible because both copies are identical.
  useEffect(() => {
    if (!autoScroll || items.length === 0) return;
    let last = performance.now();
    const tick = (now) => {
      const dt = now - last;
      last = now;
      const setWidth = setWidthRef.current;
      if (setWidth > 0) {
        offsetRef.current = (offsetRef.current + AUTO_SPEED * (dt / 1000)) % setWidth;
        applyOffset();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoScroll, items.length]);

  const nudge = (dir) => {
    setAutoScroll(false);
    clearTimeout(resumeTimeoutRef.current);
    const setWidth = setWidthRef.current;
    if (setWidth > 0) {
      const cardStep = setWidth / items.length;
      offsetRef.current =
        ((offsetRef.current + dir * cardStep) % setWidth + setWidth) % setWidth;
      applyOffset();
    }
    resumeTimeoutRef.current = setTimeout(() => setAutoScroll(true), 2000);
  };

  // Manual drag/swipe: same offset + modulo wrap as the auto-loop and the
  // arrow buttons, so all three input methods move through the same
  // seamless circular track.
  const dragRef = useRef(null);

  const pointerX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  const onDragStart = (e) => {
    setAutoScroll(false);
    clearTimeout(resumeTimeoutRef.current);
    dragRef.current = { startX: pointerX(e), startOffset: offsetRef.current };
  };

  const onDragMove = (e) => {
    if (!dragRef.current) return;
    const setWidth = setWidthRef.current;
    if (setWidth <= 0) return;
    const delta = dragRef.current.startX - pointerX(e);
    offsetRef.current =
      ((dragRef.current.startOffset + delta) % setWidth + setWidth) % setWidth;
    applyOffset();
  };

  const onDragEnd = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    resumeTimeoutRef.current = setTimeout(() => setAutoScroll(true), 2000);
  };

  return (
    <section className="bg-cream/40 pt-0 pb-4 md:pb-10 -mt-1">
      <div className="section-container">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-4 md:mb-6">
          What people are renting in Gurgaon &amp; Noida
        </h2>
        {/* Catalog scroll */}
        <div className="relative">
          {/* Right-edge fade to hint at more content */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-16 z-10 bg-gradient-to-l from-cream/60 to-transparent" />

          {isLoading ? (
            <GallerySkeleton />
          ) : (
            <div className="overflow-hidden pb-4">
              <div
                ref={trackRef}
                className="flex gap-4 md:gap-6 w-max will-change-transform"
                onTouchStart={onDragStart}
                onTouchMove={onDragMove}
                onTouchEnd={onDragEnd}
                onMouseDown={onDragStart}
                onMouseMove={onDragMove}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
              >
                {loopItems.map((item, i) => {
                  const startingPrice = getStartingPrice(item);
                  return (
                    <Link
                      to={`/product/${item.id}`}
                      key={i < items.length ? item.id : `${item.id}-dup`}
                      draggable={false}
                      className="group shrink-0 w-[210px] md:w-[250px] flex flex-col bg-white border border-border/40 rounded-2xl overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Product image */}
                      <div className="h-[220px] md:h-[260px] w-full bg-muted/5 flex items-center justify-center p-3 border-b border-border/20 overflow-hidden shrink-0">
                        <ProductImage
                          src={item.images?.[0] || item.image}
                          alt={item.name}
                          draggable={false}
                          className="h-full w-full object-contain block group-hover:scale-[1.03] transition-transform duration-500 pointer-events-none"
                        />
                      </div>

                      {/* Product info */}
                      <div className="p-4 flex flex-col gap-1 text-left">
                        <h3 className="font-display font-semibold text-foreground text-sm truncate leading-snug">
                          {item.name}
                        </h3>
                        {startingPrice != null && (
                          <span className="font-sans font-bold text-primary text-xs mt-1 leading-none">
                            From ₹{startingPrice.toLocaleString("en-IN")}/mo
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scroll nudge buttons (desktop) */}
          <button
            onClick={() => nudge(-1)}
            className="hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-cream w-11 h-11 rounded-full shadow-elevated items-center justify-center transition-all hover:scale-105 z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => nudge(1)}
            className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-cream w-11 h-11 rounded-full shadow-elevated items-center justify-center transition-all hover:scale-105 z-10"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FurnitureGallery;

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import ProductCard from "@/components/catalog/ProductCard";
import { Package } from "lucide-react";

const PAGE_SIZE = 12;

const ProductGrid = ({ products, displayDuration }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);

  // Reset to first page whenever the filtered list changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [products]);

  // Load next page when sentinel scrolls into view
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, products.length));
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [products.length]);

  const visible = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <section className="py-0">
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Package className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Try adjusting your filters or browsing a different category to find
            what you're looking for.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {visible.length}
              </span>
              {hasMore && (
                <>
                  {" of "}
                  <span className="font-semibold text-foreground">
                    {products.length}
                  </span>
                </>
              )}{" "}
              {products.length === 1 ? "product" : "products"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            <AnimatePresence mode="popLayout">
              {visible.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  displayDuration={displayDuration}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Invisible sentinel — triggers next page load before user hits bottom */}
          {hasMore && <div ref={sentinelRef} className="h-1 mt-8" />}
        </>
      )}
    </section>
  );
};

export default ProductGrid;

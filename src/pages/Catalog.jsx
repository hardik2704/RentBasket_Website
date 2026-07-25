import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, RotateCw, ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryTabs from "@/components/catalog/CategoryTabs";
import FilterBar, { FilterSidebar } from "@/components/catalog/FilterBar";
import ProductGrid from "@/components/catalog/ProductGrid";
import TrustBenefits from "@/components/catalog/TrustBenefits";
import CatalogCTA from "@/components/catalog/CatalogCTA";
import { CATEGORIES, DURATION_OPTIONS } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { searchProducts } from "@/lib/search";

// Map a duration filter LABEL ("12 Months") → pricing key ("12_months").
const durationKeyForLabel = (label) =>
  DURATION_OPTIONS.find((d) => d.label === label)?.key ?? null;

// Default duration shown on the cards when no duration filter is active.
const DEFAULT_DURATION_KEY = "12_months";

/** Placeholder cards shown while the catalog is being fetched. */
const CatalogGridSkeleton = () => (
  <section className="py-4">
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft"
        >
          <div className="aspect-[4/3] bg-secondary animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-secondary rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-secondary rounded animate-pulse" />
            <div className="h-16 bg-secondary rounded-xl animate-pulse" />
            <div className="h-9 bg-secondary rounded-xl animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

/** Shown when the catalog fails to load, with a retry. */
const CatalogGridError = ({ onRetry }) => (
  <section className="py-4">
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Couldn't load products</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-5">
        Something went wrong fetching the catalog. Please check your connection
        and try again.
      </p>
      <button onClick={onRetry} className="btn-outline inline-flex items-center gap-2 text-sm px-5 py-2.5">
        <RotateCw className="w-4 h-4" />
        Retry
      </button>
    </div>
  </section>
);

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const { data: products = [], isLoading, isError, refetch } = useProducts();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [filters, setFilters] = useState({
    duration: null,
    priceRange: null,
    availability: false,
    bestFor: null,
  });
  const [sortBy, setSortBy] = useState("Popular");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fromUrl = searchParams.get("category");
    if (fromUrl && CATEGORIES.includes(fromUrl)) {
      setActiveCategory(fromUrl);
      setActiveSubcategory(null);
    }
  }, [searchParams]);

  const searchQuery = searchParams.get("q") || "";

  // The duration whose price the cards display. Follows the active duration
  // filter; falls back to 12 months when no duration is selected.
  const displayDurationKey =
    durationKeyForLabel(filters.duration) ?? DEFAULT_DURATION_KEY;

  // Filtered and sorted products
  const minPrice = (p) => {
    const vals = Object.values(p.pricing_by_duration ?? {}).filter((v) => v > 0);
    return vals.length ? Math.min(...vals) : Infinity;
  };

  // Subcategories per category, derived live from the loaded products — the API
  // (subcategory_label) is the source of truth, so chips auto-update when the
  // backend adds/renames a subcategory instead of going stale against a hardcoded
  // list. Order follows first appearance in the catalog. Only "real" categories
  // (those matching a product's `category` field) get chips — the derived ones
  // like Bestsellers / Short-Term Rental span categories and have none.
  const subcategoriesByCategory = useMemo(() => {
    const map = {};
    for (const p of products) {
      const cat = p.category;
      const sub = p.subcategory;
      if (!cat || !sub) continue;
      if (!map[cat]) map[cat] = [];
      if (!map[cat].includes(sub)) map[cat].push(sub);
    }
    return map;
  }, [products]);

  const activeSubcategories = subcategoriesByCategory[activeCategory] ?? [];

  const nonEmptyCategories = useMemo(() => {
    const set = new Set(["All"]);
    for (const cat of CATEGORIES) {
      if (cat === "All") continue;
      let has;
      if (cat === "Bestsellers") {
        has = products.some((p) => p.tags?.includes("Bestseller"));
      } else if (cat === "Short-Term Rental") {
        has = products.some(
          (p) =>
            p.best_for?.includes("Short stays") ||
            p.best_for?.includes("Events") ||
            p.tags?.includes("Event-ready")
        );
      } else if (cat === "Complete Home Setup") {
        has = products.some(
          (p) =>
            p.best_for?.includes("Complete setups") ||
            p.tags?.includes("Complete setups")
        );
      } else {
        has = products.some((p) => p.category === cat);
      }
      if (has) set.add(cat);
    }
    return set;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== "All") {
      if (activeCategory === "Bestsellers") {
        result = result.filter((p) => p.tags?.includes("Bestseller"));
      } else if (activeCategory === "Short-Term Rental") {
        result = result.filter(
          (p) =>
            p.best_for?.includes("Short stays") ||
            p.best_for?.includes("Events") ||
            p.tags?.includes("Event-ready")
        );
      } else if (activeCategory === "Complete Home Setup") {
        result = result.filter(
          (p) =>
            p.best_for?.includes("Complete setups") ||
            p.tags?.includes("Complete setups")
        );
      } else {
        result = result.filter((p) => p.category === activeCategory);
      }
    }

    // Subcategory filter
    if (activeSubcategory) {
      result = result.filter((p) => p.subcategory === activeSubcategory);
    }

    // Search query filter (fuzzy + synonyms via Fuse.js)
    if (searchQuery.trim()) {
      result = searchProducts(result, searchQuery);
    }

    // Availability filter
    if (filters.availability) {
      result = result.filter((p) => p.stock_status === "in_stock");
    }

    // Best for filter
    if (filters.bestFor) {
      result = result.filter((p) => p.best_for?.includes(filters.bestFor));
    }

    // Duration filter — only keep products that actually have a price for the
    // chosen duration (the cards then render that duration's price).
    const durationKey = durationKeyForLabel(filters.duration);
    if (durationKey) {
      result = result.filter(
        (p) => (p.pricing_by_duration?.[durationKey] ?? 0) > 0
      );
    }

    // Skip sort when search is active — results are already ranked by relevance
    if (searchQuery.trim()) return result;

    // Sorting
    switch (sortBy) {
      case "Price: Low → High":
        result.sort((a, b) => minPrice(a) - minPrice(b));
        break;
      case "Price: High → Low":
        result.sort((a, b) => minPrice(b) - minPrice(a));
        break;
      case "Top Rated":
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "Newest":
        result.sort((a, b) => {
          const aNew = a.tags?.includes("New arrival") ? 1 : 0;
          const bNew = b.tags?.includes("New arrival") ? 1 : 0;
          return bNew - aNew;
        });
        break;
      default: // Popular — trending first, then by name
        result.sort((a, b) => {
          const aBest = a.tags?.includes("Bestseller") || a.is_trending ? 1 : 0;
          const bBest = b.tags?.includes("Bestseller") || b.is_trending ? 1 : 0;
          if (bBest !== aBest) return bBest - aBest;
          return (a.name ?? "").localeCompare(b.name ?? "");
        });
    }

    return result;
  }, [products, activeCategory, activeSubcategory, filters, sortBy, searchQuery]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activeSubcategory={activeSubcategory}
          onSubcategoryChange={setActiveSubcategory}
          nonEmptyCategories={isLoading ? null : nonEmptyCategories}
          subcategories={activeSubcategories}
        />
        <div id="catalog-results" />

        {/* Mobile filter bar — hidden on desktop */}
        <div className="md:hidden">
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Desktop: sidebar + grid */}
        <div className="section-container py-6 md:py-8">
          <div className="flex gap-8 items-start">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <CatalogGridSkeleton />
              ) : isError ? (
                <CatalogGridError onRetry={() => refetch()} />
              ) : (
                <ProductGrid
                  products={filteredProducts}
                  displayDuration={displayDurationKey}
                />
              )}
            </div>
          </div>
        </div>

        <TrustBenefits />
        <CatalogCTA />
      </main>
      <Footer />

      {/* Back to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="fixed bottom-6 left-0 right-0 mx-auto w-fit z-40 flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground/15 text-foreground text-sm font-semibold backdrop-blur-sm hover:bg-foreground/30 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            Back to top
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Catalog;

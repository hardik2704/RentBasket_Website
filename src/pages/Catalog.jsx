import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, RotateCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogHero from "@/components/catalog/CatalogHero";
import CategoryTabs from "@/components/catalog/CategoryTabs";
import FilterBar from "@/components/catalog/FilterBar";
import ProductGrid from "@/components/catalog/ProductGrid";
import TrustBenefits from "@/components/catalog/TrustBenefits";
import CatalogCTA from "@/components/catalog/CatalogCTA";
import { CATEGORIES } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";

/** Placeholder cards shown while the catalog is being fetched. */
const CatalogGridSkeleton = () => (
  <section className="section-container py-8 md:py-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
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
  <section className="section-container py-8 md:py-12">
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

  useEffect(() => {
    const fromUrl = searchParams.get("category");
    if (fromUrl && CATEGORIES.includes(fromUrl)) {
      setActiveCategory(fromUrl);
      setActiveSubcategory(null);
    }
  }, [searchParams]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== "All") {
      if (activeCategory === "Bestsellers") {
        result = result.filter((p) => p.tags.includes("Bestseller"));
      } else if (activeCategory === "Short-Term Rental") {
        // Products ideal for short-term stays
        result = result.filter(
          (p) =>
            p.best_for.includes("Short stays") ||
            p.best_for.includes("Events") ||
            p.tags.includes("Event-ready")
        );
      } else if (activeCategory === "Complete Home Setup") {
        result = result.filter(
          (p) =>
            p.best_for.includes("Complete setups") ||
            p.tags.includes("Complete setups")
        );
      } else {
        result = result.filter((p) => p.category === activeCategory);
      }
    }

    // Subcategory filter
    if (activeSubcategory) {
      result = result.filter((p) => p.subcategory === activeSubcategory);
    }

    // Availability filter
    if (filters.availability) {
      result = result.filter((p) => p.stock_status === "in_stock");
    }

    // Best for filter
    if (filters.bestFor) {
      result = result.filter((p) => p.best_for.includes(filters.bestFor));
    }

    // Sorting
    switch (sortBy) {
      case "Price: Low → High":
        result.sort(
          (a, b) =>
            a.pricing_by_duration["1_month"] - b.pricing_by_duration["1_month"]
        );
        break;
      case "Price: High → Low":
        result.sort(
          (a, b) =>
            b.pricing_by_duration["1_month"] - a.pricing_by_duration["1_month"]
        );
        break;
      case "Top Rated":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "Newest":
        result.sort((a, b) => {
          const aNew = a.tags.includes("New arrival") ? 1 : 0;
          const bNew = b.tags.includes("New arrival") ? 1 : 0;
          return bNew - aNew;
        });
        break;
      default: // Popular — bestsellers first, then by rating
        result.sort((a, b) => {
          const aBest = a.tags.includes("Bestseller") ? 1 : 0;
          const bBest = b.tags.includes("Bestseller") ? 1 : 0;
          if (bBest !== aBest) return bBest - aBest;
          return b.rating - a.rating;
        });
    }

    return result;
  }, [products, activeCategory, activeSubcategory, filters, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <CatalogHero />
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activeSubcategory={activeSubcategory}
          onSubcategoryChange={setActiveSubcategory}
        />
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        {isLoading ? (
          <CatalogGridSkeleton />
        ) : isError ? (
          <CatalogGridError onRetry={() => refetch()} />
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
        <TrustBenefits />
        <CatalogCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;

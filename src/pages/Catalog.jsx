import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogHero from "@/components/catalog/CatalogHero";
import CategoryTabs from "@/components/catalog/CategoryTabs";
import FilterBar from "@/components/catalog/FilterBar";
import ProductGrid from "@/components/catalog/ProductGrid";
import TrustBenefits from "@/components/catalog/TrustBenefits";
import CatalogCTA from "@/components/catalog/CatalogCTA";
import products from "@/data/products";

const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [filters, setFilters] = useState({
    duration: null,
    priceRange: null,
    availability: false,
    bestFor: null,
  });
  const [sortBy, setSortBy] = useState("Popular");

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
  }, [activeCategory, activeSubcategory, filters, sortBy]);

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
        <ProductGrid products={filteredProducts} />
        <TrustBenefits />
        <CatalogCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;

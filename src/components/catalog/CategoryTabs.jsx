import { useRef, useEffect } from "react";
import { CATEGORIES, SUBCATEGORIES } from "@/data/products";

const CategoryTabs = ({
  activeCategory,
  onCategoryChange,
  activeSubcategory,
  onSubcategoryChange,
}) => {
  const tabsRef = useRef(null);
  const chipsRef = useRef(null);

  // Auto-scroll active tab into view on mobile
  useEffect(() => {
    if (tabsRef.current) {
      const activeTab = tabsRef.current.querySelector("[data-active='true']");
      if (activeTab) {
        activeTab.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeCategory]);

  const subcategories = SUBCATEGORIES[activeCategory] || [];

  return (
    <div className="sticky top-16 md:top-20 z-40 bg-background border-b border-border">
      <div className="section-container">
        {/* Primary Category Tabs */}
        <div
          ref={tabsRef}
          className="flex gap-1 md:gap-2 py-3 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORIES.map((category) => (
            <button
              key={category}
              data-active={activeCategory === category}
              onClick={() => {
                onCategoryChange(category);
                onSubcategoryChange(null);
              }}
              className={`px-4 py-2 text-sm md:text-base font-medium whitespace-nowrap rounded-full transition-all duration-300 flex-shrink-0 ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Subcategory Chips */}
        {subcategories.length > 0 && (
          <div
            ref={chipsRef}
            className="flex gap-2 pb-3 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <button
              onClick={() => onSubcategoryChange(null)}
              className={`px-3 py-1.5 text-xs md:text-sm font-medium whitespace-nowrap rounded-full border transition-all duration-300 flex-shrink-0 ${
                activeSubcategory === null
                  ? "border-primary text-primary bg-primary/5"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              All {activeCategory}
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => onSubcategoryChange(sub)}
                className={`px-3 py-1.5 text-xs md:text-sm font-medium whitespace-nowrap rounded-full border transition-all duration-300 flex-shrink-0 ${
                  activeSubcategory === sub
                    ? "border-primary text-primary bg-primary/5"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTabs;

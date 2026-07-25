import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DURATION_OPTIONS, BEST_FOR_OPTIONS, SORT_OPTIONS } from "@/data/products";

const FilterBar = ({ filters, onFilterChange, sortBy, onSortChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const activeFilterCount = [
    filters.duration,
    filters.priceRange,
    filters.availability,
    filters.bestFor,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    onFilterChange({
      duration: null,
      priceRange: null,
      availability: false,
      bestFor: null,
    });
  };

  // Dropdown component
  const Dropdown = ({ label, name, options, value, onChange, className = "" }) => (
    <div className={`relative ${className}`}>
      <button
        onClick={() => toggleDropdown(name)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
          value
            ? "bg-foreground text-background border-foreground shadow-sm"
            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
        }`}
      >
        {value || label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            openDropdown === name ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {openDropdown === name && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 min-w-[180px] bg-card border border-border rounded-xl shadow-elevated z-50 py-2 max-h-64 overflow-y-auto"
          >
            <button
              onClick={() => {
                onChange(null);
                setOpenDropdown(null);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                !value
                  ? "bg-secondary text-foreground font-semibold border-b border-border/10"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              All
            </button>
            {options.map((opt) => {
              const optValue = typeof opt === "string" ? opt : opt.label;
              return (
                <button
                  key={optValue}
                  onClick={() => {
                    onChange(optValue);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    value === optValue
                      ? "bg-secondary text-foreground font-semibold border-b border-border/10"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {optValue}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Active filter chips
  const activeFilters = [];
  if (filters.duration)
    activeFilters.push({ key: "duration", label: filters.duration });
  if (filters.bestFor)
    activeFilters.push({ key: "bestFor", label: filters.bestFor });
  if (filters.availability)
    activeFilters.push({ key: "availability", label: "In Stock Only" });

  return (
    <>
      {/* Desktop Filter Bar */}
      <div className="hidden md:block bg-background border-b border-border">
        <div className="section-container py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Dropdown
                label="Duration"
                name="duration"
                options={DURATION_OPTIONS}
                value={filters.duration}
                onChange={(val) =>
                  onFilterChange({ ...filters, duration: val })
                }
              />
              <Dropdown
                label="Best for"
                name="bestFor"
                options={BEST_FOR_OPTIONS}
                value={filters.bestFor}
                onChange={(val) =>
                  onFilterChange({ ...filters, bestFor: val })
                }
              />

              {/* Availability Toggle */}
              <button
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    availability: !filters.availability,
                  })
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                  filters.availability
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "border-border text-muted-foreground hover:border-foreground/35 hover:text-foreground"
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full border-2 transition-colors ${
                    filters.availability
                      ? "bg-background border-background"
                      : "border-muted-foreground"
                  }`}
                />
                In Stock
              </button>
            </div>

            {/* Right Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">
                Sort:
              </span>
              <Dropdown
                label="Popular"
                name="sort"
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={onSortChange}
              />
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
              <span className="text-xs text-muted-foreground">Active:</span>
              {activeFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() =>
                    onFilterChange({
                      ...filters,
                      [f.key]: f.key === "availability" ? false : null,
                    })
                  }
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-foreground text-background text-xs font-medium hover:bg-foreground/80 transition-colors border border-foreground/10 shadow-sm"
                >
                  {f.label}
                  <X className="w-3 h-3" />
                </button>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Bar — single button */}
      <div className="md:hidden bg-background border-b border-border">
        <div className="section-container py-3 flex items-center justify-between gap-3">
          {/* Active filter chips — left side, scrollable */}
          {activeFilters.length > 0 ? (
            <div
              className="flex gap-2 overflow-x-auto flex-1 min-w-0"
              style={{ scrollbarWidth: "none" }}
            >
              {activeFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() =>
                    onFilterChange({
                      ...filters,
                      [f.key]: f.key === "availability" ? false : null,
                    })
                  }
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-foreground text-background text-xs font-medium whitespace-nowrap flex-shrink-0 shadow-sm border border-foreground/10"
                >
                  {f.label}
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          ) : (
            <span className="flex-1" />
          )}

          {/* Filter & Sort button — pinned right */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-foreground text-xs font-semibold bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter &amp; Sort
            {(activeFilterCount > 0 || (sortBy && sortBy !== "Popular")) && (
              <span className="w-4 h-4 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount + (sortBy && sortBy !== "Popular" ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Filter & Sort — right-side drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer slides in from the right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-background z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="text-base font-bold">Filter &amp; Sort</h3>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

                {/* Sort */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Sort by</h4>
                  <div className="flex flex-col gap-2">
                    {SORT_OPTIONS.map((opt) => {
                      const val = typeof opt === "string" ? opt : opt.label;
                      const isActive = sortBy === val;
                      return (
                        <button
                          key={val}
                          onClick={() => onSortChange(val)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                            isActive
                              ? "bg-secondary text-foreground font-medium border border-border/60"
                              : "border-border text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-border/50" />

                {/* Duration */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Duration</h4>
                  <div className="flex flex-wrap gap-2">
                    {DURATION_OPTIONS.map((d) => (
                      <button
                        key={d.key}
                        onClick={() =>
                          onFilterChange({
                            ...filters,
                            duration: filters.duration === d.label ? null : d.label,
                          })
                        }
                        className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                          filters.duration === d.label
                            ? "bg-foreground text-background border-foreground font-medium shadow-sm"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Best For */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Best for</h4>
                  <div className="flex flex-wrap gap-2">
                    {BEST_FOR_OPTIONS.map((bf) => (
                      <button
                        key={bf}
                        onClick={() =>
                          onFilterChange({
                            ...filters,
                            bestFor: filters.bestFor === bf ? null : bf,
                          })
                        }
                        className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                          filters.bestFor === bf
                            ? "bg-foreground text-background border-foreground font-medium shadow-sm"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {bf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Availability</h4>
                  <button
                    onClick={() =>
                      onFilterChange({ ...filters, availability: !filters.availability })
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all ${
                      filters.availability
                        ? "bg-foreground text-background border-foreground font-medium shadow-sm"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full border-2 transition-colors ${
                        filters.availability ? "bg-background border-background" : "border-muted-foreground"
                      }`}
                    />
                    In Stock Only
                  </button>
                </div>
              </div>

              {/* Footer actions — always visible at bottom */}
              <div className="px-5 py-4 border-t border-border flex gap-3">
                <button
                  onClick={() => {
                    clearAllFilters();
                    onSortChange("Popular");
                    setMobileOpen(false);
                  }}
                  className="btn-outline flex-1 py-3 text-sm"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary flex-1 py-3 text-sm"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/** Desktop sticky sidebar — used in place of the top FilterBar on md+ */
export const FilterSidebar = ({ filters, onFilterChange, sortBy, onSortChange }) => {
  const clearAllFilters = () =>
    onFilterChange({ duration: null, priceRange: null, availability: false, bestFor: null });

  const hasActiveFilters = filters.duration || filters.bestFor || filters.availability;

  const PillGroup = ({ label, options, value, onChange }) => (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{label}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.label;
          const active = value === val;
          return (
            <button
              key={val}
              onClick={() => onChange(active ? null : val)}
              className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                active
                  ? "bg-foreground text-background border-foreground font-medium shadow-sm"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {val}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="hidden md:flex flex-col gap-6 w-56 shrink-0">
      <div className="sticky top-20 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-foreground/80 hover:text-primary hover:underline font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Sort */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Sort by</h4>
          <div className="flex flex-col gap-1.5">
            {SORT_OPTIONS.map((opt) => {
              const val = typeof opt === "string" ? opt : opt.label;
              const active = sortBy === val;
              return (
                <button
                  key={val}
                  onClick={() => onSortChange(val)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all text-left ${
                    active
                      ? "bg-secondary text-foreground font-semibold border border-border"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {val}
                  {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border/50" />

        {/* Duration */}
        <PillGroup
          label="Duration"
          options={DURATION_OPTIONS}
          value={filters.duration}
          onChange={(val) => onFilterChange({ ...filters, duration: val })}
        />

        <div className="border-t border-border/50" />

        {/* Best for */}
        <PillGroup
          label="Best for"
          options={BEST_FOR_OPTIONS}
          value={filters.bestFor}
          onChange={(val) => onFilterChange({ ...filters, bestFor: val })}
        />

        <div className="border-t border-border/50" />

        {/* Availability */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Availability</h4>
          <button
            onClick={() => onFilterChange({ ...filters, availability: !filters.availability })}
            className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm transition-all ${
              filters.availability
                ? "bg-foreground text-background border-foreground font-medium shadow-sm"
                : "border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            <span className={`w-3 h-3 rounded-full border-2 transition-colors ${
              filters.availability ? "bg-background border-background" : "border-muted-foreground"
            }`} />
            In Stock Only
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FilterBar;

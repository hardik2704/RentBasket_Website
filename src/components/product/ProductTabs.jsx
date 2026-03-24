import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { key: "description", label: "Description" },
    { key: "specifications", label: "Specifications" },
    { key: "included", label: "What's Included" },
    { key: "terms", label: "Rental Terms" },
    { key: "support", label: "Care & Support" },
  ];

  // Accordion state for mobile
  const [openAccordion, setOpenAccordion] = useState("description");

  const renderContent = (key) => {
    switch (key) {
      case "description":
        return (
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="leading-relaxed">{product.subtitle}</p>
            <p className="leading-relaxed mt-3">{product.short_description}</p>
            <p className="leading-relaxed mt-3">
              RentBasket makes renting {product.category?.toLowerCase() || "products"} simple and hassle-free.
              Whether you're settling into a new city, furnishing a temporary home, or just
              exploring what works — renting is smarter than buying. Enjoy all the comfort
              without the burden of ownership.
            </p>
          </div>
        );
      case "specifications":
        return (
          <div className="space-y-0">
            {Object.entries(product.specifications || {}).map(([key, val], i) => (
              <div
                key={key}
                className={`flex items-center justify-between py-2.5 px-1 ${
                  i > 0 ? "border-t border-border/50" : ""
                }`}
              >
                <span className="text-sm text-muted-foreground">{key}</span>
                <span className="text-sm font-medium text-foreground">{val}</span>
              </div>
            ))}
          </div>
        );
      case "included":
        return (
          <ul className="space-y-2">
            {(product.whats_included || []).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        );
      case "terms":
        return (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.rental_terms || "Flexible rental terms apply. Contact us for details."}
          </p>
        );
      case "support":
        return (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.care_support || "Full maintenance and support included during your rental period."}
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <section className="section-container py-8 md:py-12">
      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <div className="flex gap-1 border-b border-border mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.key
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="min-h-[120px]"
          >
            {renderContent(activeTab)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Accordions */}
      <div className="md:hidden space-y-2">
        <h2 className="text-xl font-display font-bold mb-4">Product Details</h2>
        {tabs.map((tab) => {
          const isOpen = openAccordion === tab.key;
          return (
            <div
              key={tab.key}
              className="border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenAccordion(isOpen ? null : tab.key)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground bg-card"
              >
                {tab.label}
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1">
                      {renderContent(tab.key)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductTabs;

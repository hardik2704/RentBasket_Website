import { AnimatePresence } from "framer-motion";
import ProductCard from "@/components/catalog/ProductCard";
import { Package } from "lucide-react";

const ProductGrid = ({ products }) => {
  return (
    <section className="section-container py-8 md:py-12">
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
                {products.length}
              </span>{" "}
              {products.length === 1 ? "product" : "products"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </section>
  );
};

export default ProductGrid;

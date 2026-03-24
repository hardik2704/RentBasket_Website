import { getRelatedProducts } from "@/data/products";
import ProductCard from "@/components/catalog/ProductCard";

const RelatedProducts = ({ productId }) => {
  const related = getRelatedProducts(productId);
  if (related.length === 0) return null;

  return (
    <section className="bg-secondary/30 py-10 md:py-14">
      <div className="section-container">
        <h2 className="text-xl md:text-2xl font-display font-bold mb-6 md:mb-8">
          You may also like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {related.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;

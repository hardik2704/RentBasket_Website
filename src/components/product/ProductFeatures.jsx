import * as Icons from "lucide-react";

const ProductFeatures = ({ product }) => {
  const features = product.features || [];
  if (features.length === 0) return null;

  return (
    <section className="section-container py-8 md:py-12">
      <h2 className="text-xl md:text-2xl font-display font-bold mb-6">
        Key Features
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {features.map((f, i) => {
          const IconComp = Icons[f.icon] || Icons.Check;
          return (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-soft transition-shadow group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 transition-transform">
                <IconComp className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs md:text-sm font-medium text-foreground">
                {f.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductFeatures;

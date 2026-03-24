import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProductGallery = ({ product }) => {
  const images = product.images || [product.image];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const activeImage = images[activeIndex];
  const productTags = product.tags?.slice(0, 3) || [];

  // Add feature-based tags
  const featureTags = [];
  if (product.specifications) {
    if (product.specifications["Machine Type"]) featureTags.push(product.specifications["Machine Type"]);
    if (product.specifications["Loading Type"]) featureTags.push(product.specifications["Loading Type"]);
  }
  const allTags = [...productTags, ...featureTags].slice(0, 4);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Hero Image */}
      <div
        className="relative bg-gray-50 rounded-2xl overflow-hidden border border-border shadow-soft aspect-square md:aspect-[4/3]"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Tags */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
          {allTags.map((tag, i) => (
            <span
              key={i}
              className={`text-[10px] md:text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/90 text-foreground backdrop-blur-sm border border-border/50"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Image with zoom */}
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={activeImage}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-contain p-6 md:p-10"
            style={
              isZoomed
                ? {
                    transform: "scale(1.5)",
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transition: "transform 0.1s ease-out",
                  }
                : {
                    transform: "scale(1)",
                    transition: "transform 0.3s ease-out",
                  }
            }
          />
        </AnimatePresence>
      </div>

      {/* Thumbnail Row */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 overflow-hidden bg-gray-50 transition-all duration-200 flex-shrink-0 ${
                activeIndex === i
                  ? "border-primary shadow-soft"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <img
                src={img}
                alt={`${product.name} view ${i + 1}`}
                className="w-full h-full object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;

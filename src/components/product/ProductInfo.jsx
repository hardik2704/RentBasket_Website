import { Star, CheckCircle, MapPin, Shield } from "lucide-react";

const ProductInfo = ({ product }) => {
  return (
    <div className="space-y-4">
      {/* Title */}
      <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
        {product.name}
      </h1>

      {/* Subtitle */}
      {product.subtitle && (
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          {product.subtitle}
        </p>
      )}

      {/* Rating & Reviews */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? "fill-gold text-gold"
                  : "text-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-foreground">
          {product.rating}
        </span>
        <span className="text-sm text-muted-foreground">
          ({product.review_count || 0} reviews)
        </span>
      </div>

      {/* Availability & Location */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
          <CheckCircle className="w-4 h-4" />
          In Stock
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          Available in Delhi NCR
        </span>
      </div>

      {/* Trust Line */}
      <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
        <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-green-700 font-medium">
          Free delivery, installation & maintenance included with every rental
        </p>
      </div>

      {/* Short Description */}
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
        {product.short_description}
      </p>
    </div>
  );
};

export default ProductInfo;

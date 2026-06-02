import { Star, CheckCircle, XCircle, MapPin, Shield } from "lucide-react";

const STOCK_STATUS = {
  in_stock: { label: "In Stock", Icon: CheckCircle, className: "text-success" },
  limited: { label: "Limited Stock", Icon: CheckCircle, className: "text-amber-500" },
  out_of_stock: { label: "Out of Stock", Icon: XCircle, className: "text-muted-foreground" },
};

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
        {(() => {
          const { label, Icon, className } =
            STOCK_STATUS[product.stock_status] ?? STOCK_STATUS.in_stock;
          return (
            <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${className}`}>
              <Icon className="w-4 h-4" />
              {label}
            </span>
          );
        })()}
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          Available in Delhi NCR
        </span>
      </div>

      {/* Trust Line */}
      <div className="flex items-start gap-2 bg-success-muted border border-success-border rounded-xl px-4 py-3">
        <Shield className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
        <p className="text-sm text-success-muted-foreground font-medium">
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

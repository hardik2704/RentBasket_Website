import { useState } from "react";
import { CheckCircle, XCircle, MapPin, Shield, Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { shareProduct } from "@/lib/share";

const STOCK_STATUS = {
  in_stock: { label: "In Stock", Icon: CheckCircle, className: "text-success" },
  limited: { label: "Limited Stock", Icon: CheckCircle, className: "text-amber-500" },
  out_of_stock: { label: "Out of Stock", Icon: XCircle, className: "text-muted-foreground" },
};

const ProductInfo = ({ product }) => {
  const [justCopied, setJustCopied] = useState(false);

  const handleShare = async () => {
    const result = await shareProduct({
      id: product.id,
      name: product.name,
      price: product.pricing_by_duration?.["12_months"],
    });

    if (result === "copied") {
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
      toast.success("Link copied to clipboard");
    } else if (result === "failed") {
      toast.error("Couldn't share this link");
    }
    // "shared" and "cancelled" need no feedback — the OS sheet already gave it.
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
          {product.name}
        </h1>
        <button
          type="button"
          onClick={handleShare}
          aria-label={`Share ${product.name}`}
          className="shrink-0 mt-1 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm font-sans font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {justCopied ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{justCopied ? "Copied" : "Share"}</span>
        </button>
      </div>

      {/* Subtitle */}
      {product.subtitle && (
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          {product.subtitle}
        </p>
      )}

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

    </div>
  );
};

export default ProductInfo;

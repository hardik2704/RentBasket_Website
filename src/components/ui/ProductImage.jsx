import { useState, useEffect } from "react";
import { Package } from "lucide-react";

/**
 * Product image with a graceful fallback.
 *
 * Today images are local imports that always load. Once they come from the API
 * as remote URLs, some will be missing or broken — this swaps in a neutral
 * placeholder instead of showing a broken-image icon. Drop-in for a bare <img>:
 * it forwards `className` so the existing aspect-ratio container styling is kept.
 */
const ProductImage = ({ src, alt, className = "", ...props }) => {
  const [failed, setFailed] = useState(!src);

  // Reset when the source changes (e.g. switching product without remount).
  useEffect(() => {
    setFailed(!src);
  }, [src]);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-secondary text-muted-foreground ${className}`}
        role="img"
        aria-label={alt}
      >
        <Package className="w-1/4 h-1/4 max-w-12 max-h-12" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
};

export default ProductImage;

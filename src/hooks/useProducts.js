/**
 * React Query hooks over the product data-access layer.
 *
 * Components use these instead of touching `src/api/products.js` directly, so
 * they get loading/error state, caching, and retries for free. The actual data
 * source (mock vs Shivam's API) is decided inside `src/api/products.js`.
 */
import { useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductById,
  fetchRelatedProducts,
} from "@/api/products";

/** Stable cache keys so the same data is shared/deduped across the app. */
export const productKeys = {
  all: ["products"],
  detail: (id) => ["products", "detail", id],
  related: (id) => ["products", "related", id],
};

/** All products for the catalog grid. */
export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: fetchProducts,
  });
}

/** One product by id (skips fetching until an id is present). */
export function useProduct(id) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProductById(id),
    enabled: Boolean(id),
  });
}

/** Related products for a given product id. */
export function useRelatedProducts(id) {
  return useQuery({
    queryKey: productKeys.related(id),
    queryFn: () => fetchRelatedProducts(id),
    enabled: Boolean(id),
  });
}

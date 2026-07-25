/**
 * React Query hooks over the product data-access layer.
 *
 * Components use these instead of touching src/api/products.js directly, so
 * they get loading/error state, caching, and retries for free.
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductById,
  fetchRelatedProducts,
  fetchRecommendations,
} from "@/api/products";

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
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

/**
 * One product by id.
 * Uses the catalog cache as initialData so navigating from the catalog page
 * is instant — no second fetch needed. Falls back to fetchProductById only
 * when navigating directly to a product URL (cold load).
 */
export function useProduct(id) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProductById(id),
    enabled: Boolean(id),
    retry: 1,
    initialData: () => {
      const all = queryClient.getQueryData(productKeys.all);
      return all?.find((p) => String(p.id) === String(id));
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(productKeys.all)?.dataUpdatedAt,
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

/** API-driven recommendations for a given amenity_type_id. */
export function useRecommendations(amenityTypeId) {
  return useQuery({
    queryKey: ["recommendations", String(amenityTypeId)],
    queryFn: () => fetchRecommendations(amenityTypeId),
    enabled: Boolean(amenityTypeId),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

/**
 * Product data-access layer — the SINGLE seam between the UI and where
 * product data comes from.
 *
 * Pages/components never import the raw product array directly. They call
 * these functions (via the hooks in `src/hooks/useProducts.js`).
 *
 * Today:  `VITE_API_BASE_URL` is unset → we serve the bundled static catalog
 *         in `src/data/products.js` (our mock).
 * Later:  set `VITE_API_BASE_URL` → these fetch from Shivam's API instead.
 *         Flipping mock → real API is a one-file change; no UI moves.
 *
 * The per-product contract (id, name, images[], pricing_by_duration{}, deposit,
 * stock_status, …) is documented in docs/shivam-backend-meeting.md and mirrored
 * by the shape in src/data/products.js.
 */
import staticProducts, {
  getProductById as getStaticProductById,
  getRelatedProducts as getStaticRelatedProducts,
} from "@/data/products";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.trim();

/** True while no API base URL is configured — UI can show a "demo data" hint. */
export const USING_MOCK_DATA = !API_BASE;

async function request(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/** All products, for the catalog grid. */
export async function fetchProducts() {
  if (USING_MOCK_DATA) {
    return staticProducts.map((p) => ({
      ...p,
      percent_discount: p.percent_discount ?? 30,
      security_multiple: p.security_multiple ?? 2,
    }));
  }
  return request("/products");
}

/** One product by id, for the detail page. Resolves to null if not found. */
export async function fetchProductById(id) {
  if (USING_MOCK_DATA) {
    const p = getStaticProductById(id);
    if (!p) return null;
    return {
      ...p,
      percent_discount: p.percent_discount ?? 30,
      security_multiple: p.security_multiple ?? 2,
    };
  }
  return request(`/products/${encodeURIComponent(id)}`);
}

/** Related products, for the detail page / cross-sell strip. */
export async function fetchRelatedProducts(id) {
  if (USING_MOCK_DATA) {
    return getStaticRelatedProducts(id).map((p) => ({
      ...p,
      percent_discount: p.percent_discount ?? 30,
      security_multiple: p.security_multiple ?? 2,
    }));
  }
  return request(`/products/${encodeURIComponent(id)}/related`);
}

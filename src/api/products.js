/**
 * Product data-access layer — the single seam between the UI and the API.
 *
 * Mock mode  (VITE_API_BASE_URL unset): returns the static catalog in src/data/products.js
 * Live mode  (VITE_API_BASE_URL set):   fetches from Shivam's API, normalises the response
 *            into the shape the UI already expects.
 *
 * Catalog fetch:
 *   When VITE_CATALOG_API_KEY is set: single GET /get-amenity-types call (1 request).
 *   Fallback: 3-tier hierarchy (categories → subcategories → products, ~18 requests).
 *
 * See docs/api-contract.md for the full endpoint reference.
 */

import staticProducts, {
  getProductById as getStaticById,
  getRelatedProducts as getStaticRelated,
} from "@/data/products";
import { getToken, clearToken } from "./auth";

const VITE_BASE = import.meta.env.VITE_API_BASE_URL?.trim();

/** True when no API base URL is configured — falls back to bundled mock data. */
export const USING_MOCK_DATA = !VITE_BASE;

// Guard against a silent misconfiguration: a *production* build with no API URL
// means the deploy environment never set VITE_API_BASE_URL, so the site quietly
// serves the bundled ~15-item mock catalog instead of the live API. That silent
// fallback once shipped to production unnoticed — make it loud. (Dev intentionally
// uses mock data, so this only fires in a production build.) See docs/DEPLOY.md.
if (USING_MOCK_DATA && import.meta.env.PROD) {
  console.error(
    "[RentBasket] VITE_API_BASE_URL is not set in this production build — serving " +
      "the bundled MOCK catalog (~15 sample products), NOT the live API. Set " +
      "VITE_API_BASE_URL and VITE_CATALOG_API_KEY in the deploy environment. See docs/DEPLOY.md.",
  );
}

// In dev the Vite proxy forwards /api/* to the real server (avoids CORS).
// In production the full URL is used directly.
const API_BASE = import.meta.env.DEV ? "/api" : VITE_BASE;

// Static API key for the bulk catalog endpoint — uses Authorization-Key header
// instead of the Bearer JWT used by all other endpoints.
const CATALOG_API_KEY = import.meta.env.VITE_CATALOG_API_KEY?.trim();

// ---------------------------------------------------------------------------
// Low-level fetch helpers
// ---------------------------------------------------------------------------

/** Standard fetch — attaches Bearer JWT, retries once on 401. */
async function apiFetch(path) {
  const token = await getToken();
  let res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    clearToken();
    const fresh = await getToken();
    res = await fetch(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${fresh}` },
    });
  }

  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json();
}

/** Catalog-specific fetch — uses the static Authorization-Key header. */
async function catalogFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Authorization-Key": CATALOG_API_KEY },
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Normaliser — maps raw API item shape → UI shape
// ---------------------------------------------------------------------------

function buildSpecifications(item) {
  const specs = {};
  if (item.material)           specs["Material"]      = item.material;
  if (item.color_display)      specs["Color"]         = item.color_display;
  if (item.dimensions_display) specs["Dimensions"]    = item.dimensions_display;
  if (item.configuration)      specs["Configuration"] = item.configuration;
  if (item.assembly)           specs["Assembly"]      = item.assembly;
  const cap = parseFloat(item.capacity_in_litres);
  if (!isNaN(cap) && cap > 0)  specs["Capacity"]      = `${cap} L`;
  return Object.keys(specs).length ? specs : null;
}

function normalizeProduct(item, meta = {}) {
  const pricing = {};
  if ((item.rent_3 ?? 0) > 0) pricing["3_months"] = item.rent_3;
  if ((item.rent_6 ?? 0) > 0) pricing["6_months"] = item.rent_6;
  if ((item.rent_9 ?? 0) > 0) pricing["9_months"] = item.rent_9;
  if ((item.rent_12 ?? 0) > 0) pricing["12_months"] = item.rent_12;

  return {
    id: String(item.amenity_type_id),
    name: item.amenity_type_name,
    subtitle: item.prod_subtitle ?? null,
    // prod_description is being filled progressively — nullable until complete
    description: item.prod_description ?? null,
    short_description: item.prod_description ?? null,
    specifications: buildSpecifications(item),
    image: item.small_image_path ?? null,
    images: [item.large_image_path].filter(Boolean),
    pricing_by_duration: pricing,
    percent_discount: item.percent_discount ?? 0,
    adv_security: item.adv_security ?? null,
    security_multiple: item.security_multiple ?? null,
    // in_stock: 1 = In Stock, 2 = Out of Stock, 0 = DB error (treat as In Stock)
    stock_status: item.in_stock === 2 ? "out_of_stock" : "in_stock",
    is_trending: item.is_trending === 1,
    category: meta.categoryName ?? null,
    subcategory: meta.subcategoryName ?? null,
    subcategory_id: meta.subcategoryId ?? null,
  };
}

// ---------------------------------------------------------------------------
// Data loading
// ---------------------------------------------------------------------------

// Catalog category IDs that belong in the customer-facing UI.
const CATALOG_CATEGORY_IDS = [1, 2, 3]; // Furniture, Appliances, Rugs & Mattresses

// /get-amenity-types returns category_id (not category_name) — map it here.
const CATEGORY_ID_TO_NAME = {
  1: "Furniture",
  2: "Appliances",
  3: "Rugs & Mattresses",
};

/** Single-call path: bulk endpoint now includes subcategory_label, so 1 request total. */
async function loadAllProductsBulk() {
  const res = await catalogFetch("/get-amenity-types");
  return res.data.items.map((item) =>
    normalizeProduct(item, {
      categoryName: CATEGORY_ID_TO_NAME[item.category_id] ?? null,
      subcategoryName: item.subcategory_label ?? null,
      subcategoryId: item.subcategory_id ?? null,
    })
  );
}

/** Fallback 3-tier path when VITE_CATALOG_API_KEY is not set. */
async function loadAllProductsLegacy() {
  const catRes = await apiFetch("/get-amenity-category");
  const cats = catRes.data.categories.filter((c) =>
    CATALOG_CATEGORY_IDS.includes(c.category_type)
  );

  const subResults = await Promise.all(
    cats.map((cat) =>
      apiFetch(`/get-subcategories-by-category?category_id=${cat.category_type}`)
        .then((r) =>
          r.data.items.map((sub) => ({ ...sub, categoryName: cat.category_name }))
        )
    )
  );
  const subs = subResults.flat();

  const prodResults = await Promise.all(
    subs.map((sub) =>
      apiFetch(`/get-amenity-types-by-subcategory?subcategory_id=${sub.id}`)
        .then((r) =>
          r.data.items.map((item) =>
            normalizeProduct(item, {
              categoryName: sub.categoryName,
              subcategoryName: sub.subcategory_name,
              subcategoryId: sub.id,
            })
          )
        )
    )
  );

  return prodResults.flat();
}

function loadAllProducts() {
  return CATALOG_API_KEY ? loadAllProductsBulk() : loadAllProductsLegacy();
}

// ---------------------------------------------------------------------------
// Public API — same interface in mock and live mode
// ---------------------------------------------------------------------------

/** All products, for the catalog grid. */
export async function fetchProducts() {
  if (USING_MOCK_DATA) return staticProducts;
  return loadAllProducts();
}

/**
 * One product by id.
 * In practice the useProduct() hook uses initialData from the catalog cache,
 * so this raw fetch only fires when navigating directly to a product URL.
 */
export async function fetchProductById(id) {
  if (USING_MOCK_DATA) return getStaticById(id) ?? null;
  const all = await loadAllProducts();
  return all.find((p) => p.id === String(id)) ?? null;
}

/** Related products — endpoint not yet available, returns empty for now. */
export async function fetchRelatedProducts(id) {
  if (USING_MOCK_DATA) return getStaticRelated(id);
  return [];
}

/** Recommendations for a given product. Returns normalized products or [] on any failure. */
export async function fetchRecommendations(amenityTypeId) {
  if (USING_MOCK_DATA) return [];
  const json = await apiFetch(`/get-product-recommendations?amenity_type_id=${amenityTypeId}`);
  if (json.responseCode !== 200) return [];
  return (json.data?.recommendations ?? []).map((item) => {
    const base = normalizeProduct(item, {
      categoryName: CATEGORY_ID_TO_NAME[item.category_id] ?? null,
      subcategoryName: item.subcategory_label ?? null,
      subcategoryId: item.subcategory_id ?? null,
    });
    let key_features = {};
    try { key_features = JSON.parse(item.key_features || "{}"); } catch { /* malformed JSON — skip */ }
    return { ...base, key_features };
  });
}

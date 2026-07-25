import Fuse from "fuse.js";
import { stemmer } from "stemmer";

// ─── Synonym map ──────────────────────────────────────────────────────────────
// Maps common user terms → canonical terms that appear in product data.
// Handles the vocabulary gap: user says "fridge", data says "Refrigerator".
const SYNONYMS = {
  fridge: "refrigerator",
  "fridge freezer": "refrigerator",
  ac: "air conditioner",
  "air con": "air conditioner",
  aircon: "air conditioner",
  "air conditioning": "air conditioner",
  cooler: "air conditioner",
  couch: "sofa",
  settee: "sofa",
  loveseat: "sofa",
  recliner: "sofa",
  washer: "washing machine",
  laundry: "washing machine",
  telly: "tv",
  television: "tv",
  "flat screen": "tv",
  "flat-screen": "tv",
  microwave: "microwave",
  "microwave oven": "microwave",
  oven: "microwave",
  wardrobe: "wardrobe",
  cupboard: "wardrobe",
  closet: "wardrobe",
  almirah: "wardrobe",
  almira: "wardrobe",
  "water purifier": "ro",
  purifier: "ro",
  "water filter": "ro",
  cot: "bed",
  mattress: "bed",
  desk: "table",
  seating: "chair",
  stool: "chair",
  appliance: "appliances",
  furniture: "furniture",
};

// ─── Stemming helpers ─────────────────────────────────────────────────────────
// Stems a multi-word string: each word reduced to its root form.
// e.g. "washing machines" → "wash machin", "chairs" → "chair"
// We stem both the query and the product text so they meet at the same root.
function stemPhrase(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .map(stemmer)
    .join(" ");
}

// ─── Query expansion ──────────────────────────────────────────────────────────
// Returns an array of search terms from a single raw query string:
//   1. The original query (for direct / fuzzy matching)
//   2. Any synonym expansions found in the table
//   3. The stemmed version of the query (for word-form matching)
function expandQuery(raw) {
  const lower = raw.toLowerCase().trim();
  const terms = new Set([lower]);

  for (const [alias, canonical] of Object.entries(SYNONYMS)) {
    if (lower.includes(alias)) terms.add(canonical);
  }

  const stemmed = stemPhrase(lower);
  if (stemmed && stemmed !== lower) terms.add(stemmed);

  return [...terms];
}

// ─── Fuse.js config ───────────────────────────────────────────────────────────
// _stemmedText is a virtual field we add to each product (see prepareProducts).
// Searching it means the stemmed query can match even when word forms differ.
const FUSE_OPTIONS = {
  keys: [
    { name: "name", weight: 3 },
    { name: "subcategory", weight: 2 },
    { name: "_stemmedText", weight: 1.5 }, // stemmed index of all text fields
    { name: "tags", weight: 1.5 },
    { name: "best_for", weight: 1 },
    { name: "short_description", weight: 1 },
    { name: "subtitle", weight: 0.8 },
    { name: "category", weight: 0.5 },
  ],
  // 0 = exact match required, 1 = match anything.
  // 0.35 allows ~1-2 character typos without being too loose.
  threshold: 0.35,
  minMatchCharLength: 2,
  includeScore: true,
  ignoreLocation: true,
};

// ─── Index cache ──────────────────────────────────────────────────────────────
// Building the Fuse index (and stemming all product text) is O(n) work we
// don't want to redo on every keystroke. Cache it and only rebuild when the
// products reference changes (i.e. after an API reload).
let _cachedProductsRef = null;
let _cachedFuse = null;

function getFuse(products) {
  if (products === _cachedProductsRef) return _cachedFuse;

  const prepared = products.map((p) => ({
    ...p,
    _stemmedText: [
      p.name,
      p.category,
      p.subcategory,
      p.short_description,
      p.subtitle,
    ]
      .filter(Boolean)
      .map(stemPhrase)
      .join(" "),
  }));

  _cachedProductsRef = products;
  _cachedFuse = new Fuse(prepared, FUSE_OPTIONS);
  return _cachedFuse;
}

// ─── Public API ───────────────────────────────────────────────────────────────
/**
 * Searches products using three-layer matching:
 *   synonym expansion → stemming → fuzzy (Fuse.js)
 * Returns a filtered array sorted by relevance score (best first).
 */
export function searchProducts(products, query) {
  const trimmed = query.trim();
  if (!trimmed) return products;

  const fuse = getFuse(products);
  const terms = expandQuery(trimmed);

  // Run one Fuse search per expanded term, merge results, keep best score per product
  const seen = new Map(); // id → { item, score }
  for (const term of terms) {
    for (const result of fuse.search(term)) {
      const existing = seen.get(result.item.id);
      if (!existing || result.score < existing.score) {
        seen.set(result.item.id, result);
      }
    }
  }

  return [...seen.values()]
    .sort((a, b) => a.score - b.score)
    .map((r) => r.item);
}

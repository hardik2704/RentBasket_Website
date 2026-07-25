/**
 * GitHub Pages is static-only. Without real files, /catalog returns HTTP 404
 * (even when 404.html loads the SPA). This script:
 * 1. Copies index.html → 404.html (fallback for unknown paths)
 * 2. Copies index.html → <route>/index.html (HTTP 200 for known routes)
 * @see https://github.com/rafgraph/spa-github-pages
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "fs";
import { join } from "path";

const distDir = join(process.cwd(), "dist");
const indexPath = join(distDir, "index.html");

if (!existsSync(indexPath)) {
  console.error("copy-spa-404: dist/index.html not found — run vite build first");
  process.exit(1);
}

function writeRouteIndex(...segments) {
  const dir = join(distDir, ...segments);
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "index.html");
  copyFileSync(indexPath, target);
  return target;
}

// SPA fallback (product deep-links, typos, etc.)
copyFileSync(indexPath, join(distDir, "404.html"));

// Static routes — GitHub Pages serves these with HTTP 200
const staticRoutes = [
  "catalog",
  "catalogue",
  "basket",
  "cart", // legacy — SPA client-redirects /cart → /basket
  "checkout",
  "order-success",
  "terms-n-conditions",
  "shipping-returns",
  "faqs",
  "about",
  "contact"
];
for (const route of staticRoutes) {
  writeRouteIndex(route);
}

// Product detail pages
const productsSource = readFileSync(
  join(process.cwd(), "src", "data", "products.js"),
  "utf8"
);
const productIds = [
  ...productsSource.matchAll(/^\s+id:\s*"([^"]+)"/gm),
].map((m) => m[1]);

for (const id of productIds) {
  writeRouteIndex("product", id);
}

console.log(
  `copy-spa-404: wrote 404.html + ${staticRoutes.length} routes + ${productIds.length} product pages`
);

/**
 * Product link + sharing helpers.
 *
 * Routes are registered in pairs (`/product/:id` and `/product/:id/`) because
 * the static host serves route folders with a trailing slash, so links are
 * built with one. `import.meta.env.BASE_URL` keeps these correct when the app
 * is served from a subpath rather than the domain root.
 */

/** App-relative product path, e.g. "/product/42/". */
export function productUrl(id) {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}/product/${id}/`;
}

/** Absolute, shareable product URL. */
export function absoluteProductUrl(id) {
  if (typeof window === "undefined") return productUrl(id);
  return new URL(productUrl(id), window.location.origin).href;
}

/**
 * Share a product. Opens the OS share sheet on touch devices and copies the
 * link to the clipboard on desktop.
 *
 * The touch check matters: desktop Chrome *does* expose navigator.share, but
 * routing desktop users into an OS share dialog is worse than a copied link —
 * and on some platforms it silently does nothing, leaving the user with no
 * feedback at all.
 *
 * Resolves to "shared" | "copied" | "cancelled" | "failed".
 */
export async function shareProduct({ id, name, price }) {
  const url = absoluteProductUrl(id);
  const title = name ? `${name} — RentBasket` : "RentBasket";
  const text = price
    ? `${name} — from ₹${Number(price).toLocaleString("en-IN")}/mo on RentBasket`
    : `Check out ${name ?? "this"} on RentBasket`;

  const isTouch =
    typeof navigator !== "undefined" &&
    (navigator.maxTouchPoints > 0 || "ontouchstart" in window);

  if (isTouch && navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch (err) {
      // Dismissing the share sheet is not an error worth surfacing.
      if (err?.name === "AbortError") return "cancelled";
      // Anything else: fall through to the clipboard.
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
}

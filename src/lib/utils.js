import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a random ID with an optional prefix.
 * Uses crypto.randomUUID() when available (secure contexts / modern browsers),
 * falling back to a timestamp+random suffix so it works on http origins and
 * older browsers too.
 *
 * @param {string} [prefix="id"] - Short label prepended to the fallback string
 *   (ignored when randomUUID is available since UUIDs are already unique).
 * @returns {string}
 */
export function makeId(prefix = "id") {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

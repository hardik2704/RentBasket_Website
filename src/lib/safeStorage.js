/**
 * Safe wrappers around Web Storage (localStorage / sessionStorage).
 *
 * Storage writes can throw in private/incognito mode, when quota is exceeded,
 * or when storage is disabled by browser policy. The raw API is fine to call
 * on reads (we already catch those), but WRITES must go through here so an
 * unhandled throw can't escape to the global ErrorBoundary and crash the app.
 *
 * All helpers accept an optional `storage` argument (default: localStorage) so
 * callers can pass `sessionStorage` where needed.
 *
 * On failure: console.warn is emitted, the function returns false/null, and the
 * in-memory React state remains correct — only persistence is lost.
 */

/**
 * @param {string} key
 * @param {Storage} [storage]
 * @returns {string|null}
 */
export function safeGet(key, storage = localStorage) {
  try {
    return storage.getItem(key);
  } catch (err) {
    console.warn(`[safeStorage] getItem("${key}") failed:`, err);
    return null;
  }
}

/**
 * @param {string} key
 * @param {string} value
 * @param {Storage} [storage]
 * @returns {boolean} true on success, false on failure
 */
export function safeSet(key, value, storage = localStorage) {
  try {
    storage.setItem(key, value);
    return true;
  } catch (err) {
    console.warn(`[safeStorage] setItem("${key}") failed:`, err);
    return false;
  }
}

/**
 * @param {string} key
 * @param {Storage} [storage]
 * @returns {boolean} true on success, false on failure
 */
export function safeRemove(key, storage = localStorage) {
  try {
    storage.removeItem(key);
    return true;
  } catch (err) {
    console.warn(`[safeStorage] removeItem("${key}") failed:`, err);
    return false;
  }
}

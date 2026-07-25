import { authFetch } from "./client";

const FALLBACK_KEY = "rentbasket_address";

const fallbackGet = () => {
  try { return JSON.parse(localStorage.getItem(FALLBACK_KEY)) || null; } catch { return null; }
};
const fallbackSet = (data) => {
  try { localStorage.setItem(FALLBACK_KEY, JSON.stringify(data)); } catch { /* storage unavailable — skip cache */ }
};

// The API and the form use DIFFERENT field names. We map API→form on read
// (normalizeAddress) and form→API on write (toApiAddress) — both must exist or
// the round-trip silently drops everything.
// API:  full_name, mobile, flat_no, area, landmark, pincode, city_name, state_name, lat, lng
// Form: contact_name, contact_phone, address_line_1, address_line_2, landmark, pincode, city, state, lat, lng
function normalizeAddress(raw) {
  return {
    address_id:    raw.id ?? null,
    contact_name:  raw.full_name ?? "",
    contact_phone: raw.mobile ?? "",
    address_line_1: raw.flat_no ?? "",
    address_line_2: raw.area ?? "",
    landmark:      raw.landmark ?? "",
    pincode:       raw.pincode ?? "",
    city:          raw.city_name ?? "",
    state:         raw.state_name?.trim() ?? "",
    lat:           raw.lat ?? null,
    lng:           raw.lng ?? null,
    servicable:    raw.servicable ?? null,
  };
}

// Map the form shape back to the API field names the write endpoint expects
// (per docs/shivam-pending.md 3b: mobile, full_name, flat_no, area, landmark,
// pincode, city, state, lat, lng). Sending the form names (address_line_1, etc.)
// is what made the backend reject the save with "Invalid Details".
function toApiAddress(mobile, form) {
  return {
    mobile,
    full_name: form.contact_name ?? "",
    flat_no:   form.address_line_1 ?? "",
    area:      form.address_line_2 ?? "",
    landmark:  form.landmark ?? "",
    pincode:   form.pincode ?? "",
    city:      form.city ?? "",
    state:     form.state ?? "",
    lat:       form.lat ?? null,
    lng:       form.lng ?? null,
  };
}

/**
 * Fetch the user's single saved address. Falls back to localStorage if the
 * API is not yet live or returns an error.
 */
export async function getUserAddress(mobile) {
  try {
    const res = await authFetch(`/get-delivery-address?mobile=${encodeURIComponent(mobile)}`);
    const json = await res.json().catch(() => null);
    if (res.ok && json?.responseCode === 200) {
      // Only the nested `address` object is a real address. Do NOT fall back to
      // json.data here — when no address is saved the API returns
      // { address: null }, and json.data is the truthy wrapper, which would
      // normalise to an all-empty husk and (worse) get cached over good data.
      const raw = json.data?.address ?? null;
      if (raw) {
        const addr = normalizeAddress(raw);
        fallbackSet(addr);
        return addr;
      }
      // Server explicitly has no address — return the local cache if we have a
      // real one, but never cache the empty server result.
      return fallbackGet();
    }
  } catch { /* API down — serve the cached copy below */ }
  return fallbackGet();
}

/**
 * Save (create or update) the user's single address. Uses POST for new
 * addresses and PUT for existing ones, determined by whether a cached
 * address_id is present. Always updates the local cache regardless of
 * API success so the data survives an offline session.
 */
export async function saveUserAddress(mobile, address) {
  const cached = fallbackGet();
  const isNew = !cached?.address_id;
  // Send the API field names, not the form's — the backend rejects the form
  // shape (address_line_1, contact_name, ...) with "Invalid Details".
  const body = toApiAddress(mobile, address);
  try {
    const res = await authFetch(
      isNew ? "/add-delivery-address" : "/update-delivery-address",
      { method: isNew ? "POST" : "PUT", body }
    );
    const json = await res.json().catch(() => null);
    // The backend returns HTTP 200 even on failure, signalling success only via
    // responseCode (200/201). res.ok alone treated "Invalid Details" as a save.
    const ok = res.ok && (json?.responseCode === 200 || json?.responseCode === 201) &&
      !/invalid|fail|error/i.test(json?.data?.messageDescription || json?.message || "");
    if (ok) {
      const saved = { ...address, address_id: json?.data?.address_id ?? cached?.address_id };
      fallbackSet(saved);
      return saved;
    }
    // Surface the backend's reason so the caller can tell the user it didn't save.
    throw new Error(json?.data?.messageDescription || json?.message || `Address save failed (${res.status})`);
  } catch (err) {
    // Cache locally so the data isn't lost in-session, but propagate the failure
    // so the UI doesn't claim success when the server rejected it.
    fallbackSet({ ...cached, ...address });
    throw err;
  }
}

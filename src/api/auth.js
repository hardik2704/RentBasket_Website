/**
 * API auth — fetches and caches the bearer token for all API calls.
 * Token is held in memory (not localStorage) so it resets on page reload.
 * Any 401 from the API should call clearToken() then getToken() to retry.
 */

import { APP_KEY, AWS_BASE } from "./config";

// JWT mint goes to AWS_BASE — now testapi (the backend consolidated it off the
// retired testaws server). All other API calls use API_BASE.
// (In proxy mode both AWS_BASE and API_BASE point at the edge proxy.)

let _token = null;
let _inflight = null; // shared promise so parallel callers don't each fire a separate POST

export async function getToken() {
  if (_token) return _token;
  if (_inflight) return _inflight;
  _inflight = _refresh().finally(() => { _inflight = null; });
  return _inflight;
}

async function _fetchToken() {
  const res = await fetch(`${AWS_BASE}/get-jwt-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_key: APP_KEY }),
  });
  if (!res.ok) throw new Error(`Auth: token fetch failed (${res.status})`);
  const json = await res.json().catch(() => null);
  const token = json?.data?.jwt_token;
  if (!token) throw new Error("Auth: token missing from response");
  return token;
}

async function _refresh() {
  try {
    _token = await _fetchToken();
  } catch (err) {
    // Single retry after 1.5 s — handles transient testaws blips without
    // cascading every API call on the page into a failure.
    await new Promise((r) => setTimeout(r, 1500));
    _token = await _fetchToken();
  }
  return _token;
}

export function clearToken() {
  _token = null;
}

/**
 * Shared authenticated fetch — Bearer JWT + single 401-retry.
 *
 * Returns the raw Response so each caller keeps its own body/error parsing
 * (the api modules have intentionally different error semantics — e.g. some
 * check responseCode, some don't retry). This consolidates only the auth +
 * retry plumbing that was previously duplicated across products/kyc/proposal/
 * otp/profile.
 */
import { API_BASE } from "./config";
import { getToken, clearToken } from "./auth";

/**
 * @param {string} path                 path appended to `base`
 * @param {object} [opts]
 * @param {string} [opts.method="GET"]
 * @param {*}      [opts.body]          object → JSON; FormData → sent as-is
 * @param {object} [opts.headers={}]    extra headers
 * @param {string} [opts.base=API_BASE] override base URL (e.g. AWS_BASE)
 * @param {boolean}[opts.retry=true]    retry once after clearing token on 401
 * @returns {Promise<Response>}
 */
export async function authFetch(
  path,
  { method = "GET", body, headers = {}, base = API_BASE, retry = true } = {},
) {
  const send = (token) => {
    const opts = { method, headers: { ...headers, Authorization: `Bearer ${token}` } };
    if (body !== undefined) {
      if (body instanceof FormData) {
        opts.body = body; // let the browser set the multipart boundary
      } else {
        opts.headers["Content-Type"] = "application/json";
        opts.body = JSON.stringify(body);
      }
    }
    return fetch(`${base}${path}`, opts);
  };

  let res = await send(await getToken());
  if (res.status === 401 && retry) {
    clearToken();
    res = await send(await getToken());
  }
  return res;
}

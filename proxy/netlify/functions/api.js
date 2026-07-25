/**
 * Netlify Function wrapper around the runtime-agnostic proxy handler.
 *
 * Deployed as its own Netlify site (base directory = proxy/). With the catch-all
 * redirect in netlify.toml, every request reaches this function and event.path is
 * the original request path (e.g. "/get-amenity-types").
 */
import { handleProxy } from "../../lib/handler.js";

export async function handler(event) {
  // Strip the function prefix if the request hit the function URL directly.
  const path = event.path.replace(/^\/\.netlify\/functions\/api/, "") || "/";

  // Keep the body as raw bytes so multipart uploads (/update-kyc) survive.
  // Netlify base64-encodes binary bodies; decode to a Buffer, not a string.
  let body;
  if (event.body == null) {
    body = undefined;
  } else if (event.isBase64Encoded) {
    body = Buffer.from(event.body, "base64");
  } else {
    body = Buffer.from(event.body, "utf8");
  }

  const res = await handleProxy({
    method: event.httpMethod,
    path,
    query: event.rawQuery || "",
    headers: event.headers || {},
    body,
  });

  return { statusCode: res.status, headers: res.headers, body: res.body };
}

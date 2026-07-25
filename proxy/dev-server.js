/**
 * Local dev runner for the proxy — plain Node http server, no Netlify CLI needed.
 *
 *   API_APP_KEY=... CATALOG_API_KEY=... node proxy/dev-server.js
 *
 * Then point a browser/curl at http://localhost:8787/<endpoint>, e.g.
 *   curl http://localhost:8787/get-amenity-types
 * The proxy injects the catalog key server-side (no CORS server-to-server), so
 * this returns real catalog JSON without any key in the client.
 */
import http from "node:http";
import { handleProxy } from "./lib/handler.js";

const PORT = process.env.PORT || 8787;

const server = http.createServer(async (req, res) => {
  try {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    // Keep the body as raw bytes — multipart uploads (/update-kyc) carry binary
    // file data that a UTF-8 decode would corrupt. The handler decodes to a
    // string only for the JSON paths that need it.
    const body = chunks.length ? Buffer.concat(chunks) : undefined;
    const [path, query = ""] = req.url.split("?");

    const result = await handleProxy({
      method: req.method,
      path,
      query,
      headers: req.headers,
      body,
    });

    res.writeHead(result.status, result.headers);
    res.end(result.body);
  } catch (err) {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "proxy_error", message: String(err?.message || err) }));
  }
});

server.listen(PORT, () => {
  console.log(`[proxy] dev server on http://localhost:${PORT}`);
});

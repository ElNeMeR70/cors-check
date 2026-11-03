#!/usr/bin/env node
const target = process.argv[2];
const origin = process.argv[3] || "https://example.com";
if (!target || target === "-h" || target === "--help") {
  console.log("Usage: cors-check <url> [test-origin]");
  console.log("Example: cors-check https://api.github.com https://myapp.com");
  process.exit(target ? 0 : 1);
}
const url = target.startsWith("http") ? target : "https://" + target;
(async () => {
  console.log(`\x1b[36mTesting CORS Preflight for ${url} (Origin: ${origin})...\x1b[0m\n`);
  try {
    const res = await fetch(url, {
      method: "OPTIONS",
      headers: {
        "Origin": origin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type, Authorization"
      }
    });
    const allowOrigin = res.headers.get("access-control-allow-origin");
    const allowMethods = res.headers.get("access-control-allow-methods");
    const allowHeaders = res.headers.get("access-control-allow-headers");
    if (allowOrigin) {
      console.log(`\x1b[32m✔ CORS Enabled!\x1b[0m`);
      console.log(`  Access-Control-Allow-Origin:  \x1b[32m${allowOrigin}\x1b[0m`);
      console.log(`  Access-Control-Allow-Methods: ${allowMethods || "Not specified"}`);
      console.log(`  Access-Control-Allow-Headers: ${allowHeaders || "Not specified"}`);
    } else {
      console.log(`\x1b[31m✖ No Access-Control-Allow-Origin header returned.\x1b[0m`);
      console.log("  Status Code:", res.status);
    }
  } catch (e) {
    console.error("\x1b[31mCORS check error: " + e.message + "\x1b[0m");
    process.exit(1);
  }
})();

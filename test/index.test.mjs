// Run: node test/index.test.mjs
import assert from "node:assert/strict";
import worker from "../src/index.js";

const H = "X-Team-Sudda-Fallback";
const html = { Accept: "text/html" };
let passed = 0;
async function t(name, fn) {
  await fn();
  passed++;
  console.log("ok -", name);
}
const stubFetch = (impl) => {
  globalThis.fetch = impl;
};

await t("typo host gets the 503 maintenance page", async () => {
  const r = await worker.fetch(
    new Request("https://zz-typo-123.teamsudda.lk/x", { headers: html }),
    {},
  );
  assert.equal(r.status, 503);
  assert.equal(r.headers.get(H), "unknown-host");
  assert.equal(r.headers.get("Retry-After"), "300");
  assert.equal(r.headers.get("Cache-Control"), "no-store");
  assert.equal(r.headers.get("X-Robots-Tag"), "noindex");
  assert.match(await r.text(), /Sorry, we're under maintenance/);
});

await t("JSON / API request gets a JSON 503", async () => {
  const r = await worker.fetch(
    new Request("https://api-typo.teamsudda.lk/v1", {
      method: "POST",
      headers: { Accept: "application/json" },
    }),
    {},
  );
  assert.equal(r.status, 503);
  assert.match(r.headers.get("Content-Type"), /application\/json/);
  assert.equal((await r.json()).error, "maintenance");
});

await t("HEAD gets a 503 with no body", async () => {
  const r = await worker.fetch(new Request("https://nope.teamsudda.lk/", { method: "HEAD" }), {});
  assert.equal(r.status, 503);
  assert.equal(await r.text(), "");
});

await t("www.teamsudda.lk passes through to its Worker", async () => {
  const env = {
    SITE: {
      fetch: async (req) => new Response("site:" + new URL(req.url).pathname, { status: 200 }),
    },
  };
  const r = await worker.fetch(
    new Request("https://www.teamsudda.lk/services?x=1", { headers: html }),
    env,
  );
  assert.equal(r.status, 200);
  assert.equal(await r.text(), "site:/services");
  assert.equal(r.headers.get(H), "service");
});

await t("www.teamsudda.lk keeps the site's own 404", async () => {
  const env = { SITE: { fetch: async () => new Response("nf", { status: 404 }) } };
  const r = await worker.fetch(
    new Request("https://www.teamsudda.lk/missing", { headers: html }),
    env,
  );
  assert.equal(r.status, 404);
});

await t("www.teamsudda.lk shows maintenance when its Worker throws", async () => {
  const env = {
    SITE: {
      fetch: async () => {
        throw new Error("boom");
      },
    },
  };
  const r = await worker.fetch(new Request("https://www.teamsudda.lk/", { headers: html }), env);
  assert.equal(r.status, 503);
  assert.equal(r.headers.get(H), "service-unreachable");
});

console.log(`\n${passed} passed`);

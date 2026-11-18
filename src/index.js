/**
 * Team Sudda maintenance fallback for teamsudda.lk.
 *
 * Runs on the route *.teamsudda.lk/*. The route only sees hostnames that are
 * proxied (orange cloud) in DNS; DNS-only records never reach this Worker.
 *
 * - REDIRECTS: hosts that 301 to the canonical host (www.teamsudda.lk), keeping path and query.
 * - SERVICE_HOSTS: Worker custom domains the route can catch ahead of their own Worker. They are passed
 *   straight to that Worker through a service binding; if it errors, browsers get the maintenance page.
 * - ORIGIN_HOSTS: proxied apps on an origin server. Passed through; when the origin is down, the
 *   maintenance page is shown instead of a Cloudflare error page.
 * - Anything else (typos, retired names): the maintenance page.
 *
 * Every response carries X-Team-Sudda-Fallback, so you can see which branch answered.
 */

const HEADER = "X-Team-Sudda-Fallback";

const REDIRECTS = {};

const SERVICE_HOSTS = {
  "www.teamsudda.lk": "SITE", // team-sudda-website
  "dev.teamsudda.lk": "SITE_DEV", // team-sudda-website-dev
};

const ORIGIN_HOSTS = new Set([]);

// Gateway errors plus Cloudflare's 52x/530 "origin unreachable" family.
const DOWN_STATUSES = new Set([502, 503, 504, 520, 521, 522, 523, 524, 525, 526, 527, 530]);

const ORIGIN_TIMEOUT_MS = 25_000;

export default {
  async fetch(request, env = {}) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();

    const target = REDIRECTS[host];
    if (target) {
      url.hostname = target;
      url.protocol = "https:";
      url.port = "";
      return new Response(null, { status: 301, headers: { Location: url.toString(), [HEADER]: "redirect" } });
    }

    const binding = SERVICE_HOSTS[host];
    if (binding && env[binding]) {
      return passThrough(request, "service", (req) => env[binding].fetch(req));
    }

    if (ORIGIN_HOSTS.has(host)) {
      return passThrough(request, "origin", (req) => fetch(req));
    }

    return maintenance(request, "unknown-host");
  },
};

async function passThrough(request, kind, send) {
  try {
    const response = await send(new Request(request, { signal: AbortSignal.timeout(ORIGIN_TIMEOUT_MS) }));
    if (DOWN_STATUSES.has(response.status)) return maintenance(request, `${kind}-${response.status}`);
    const out = new Response(response.body, response);
    out.headers.set(HEADER, kind);
    return out;
  } catch (err) {
    return maintenance(request, err?.name === "TimeoutError" ? `${kind}-timeout` : `${kind}-unreachable`);
  }
}

function maintenance(request, reason) {
  const headers = {
    "Retry-After": "300",
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex",
    [HEADER]: reason,
  };

  // API and asset requests get a small JSON body so apps can show their own message.
  const accept = request.headers.get("Accept") || "";
  const isRead = request.method === "GET" || request.method === "HEAD";
  const wantsHtml = isRead && (accept.includes("text/html") || !accept.includes("application/json"));
  if (!wantsHtml) {
    return new Response(JSON.stringify({ error: "maintenance", message: "This service is temporarily unavailable." }), {
      status: 503,
      headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
    });
  }

  return new Response(request.method === "HEAD" ? null : PAGE, {
    status: 503,
    headers: { ...headers, "Content-Type": "text/html; charset=utf-8" },
  });
}

const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Under maintenance | Team Sudda</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%23ffd000'/%3E%3Ctext x='32' y='42' text-anchor='middle' font-family='Arial Black,Arial,sans-serif' font-weight='900' font-size='26' letter-spacing='-1' fill='%230a1a43'%3ETS%3C/text%3E%3C/svg%3E">
<style>
  :root { --bg1:#14296b; --bg2:#0a1a43; --bg3:#060f29; --accent:#ffd000; --on-accent:#0a1a43; --text:#ffffff; --muted:#b9c3dc; }
  * { box-sizing: border-box; }
  html, body { height: 100%; margin: 0; }
  body {
    background: radial-gradient(1200px 600px at 50% -10%, var(--bg1) 0%, var(--bg2) 45%, var(--bg3) 100%);
    color: var(--text);
    font: 16px/1.6 "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    display: grid; place-items: center; padding: 24px 16px;
  }
  main { width: 100%; max-width: 560px; text-align: center; }
  .logo { display: inline-flex; align-items: center; gap: 10px; font-weight: 800; font-size: 22px; letter-spacing: -0.01em; }
  .mark { width: 34px; height: 34px; border-radius: 12px; background: var(--accent); color: var(--on-accent); display: grid; place-items: center; font-size: 13px; font-weight: 900; }
  .logo b { color: var(--accent); font-weight: 800; }
  .icon { margin: 48px auto 28px; width: 76px; height: 76px; border-radius: 50%; background: rgb(255 255 255 / 0.08); display: grid; place-items: center; }
  .icon svg { width: 36px; height: 36px; stroke: var(--accent); }
  h1 { font-size: clamp(28px, 6vw, 40px); line-height: 1.15; letter-spacing: -0.02em; margin: 0 0 14px; }
  p { color: var(--muted); margin: 0 auto 10px; max-width: 46ch; }
  .local { font-size: 15px; }
  .actions { margin-top: 32px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .btn { display: inline-block; padding: 12px 22px; border-radius: 999px; font: inherit; font-weight: 700; text-decoration: none; cursor: pointer; border: 0; }
  .primary { background: var(--accent); color: var(--on-accent); }
  .ghost { border: 1px solid rgb(255 255 255 / 0.25); color: var(--text); background: transparent; }
  .btn:focus-visible { outline: 3px solid var(--text); outline-offset: 3px; }
  footer { margin-top: 48px; font-size: 13px; color: rgb(255 255 255 / 0.5); }
</style>
</head>
<body>
<main>
  <div class="logo"><span class="mark" aria-hidden="true">TS</span><span>Team <b>Sudda</b></span></div>
  <div class="icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
  </div>
  <h1>Sorry, we're under maintenance</h1>
  <p>This page is temporarily unavailable while we carry out some work. Please check back in a few minutes.</p>

  <div class="actions">
    <button type="button" class="btn primary" onclick="location.reload()">Try again</button>
    <a class="btn ghost" href="https://www.teamsudda.lk">Go to teamsudda.lk</a>
  </div>
  <footer>&copy; Team Sudda</footer>
</main>
</body>
</html>`;

# ADR-0001: A zone route Worker as the maintenance fallback

<!-- nav -->

<sub><a href="../../README.md">Project README</a> · <a href="../README.md">Documentation index</a></sub>

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-11-18 |

## Decision

A single Cloudflare Worker on the route `*.teamsudda.lk/*` answers every proxied hostname that no other Worker claims. It redirects, passes through to the real app, or serves an inlined branded 503 page.

## Alternatives considered

- Cloudflare custom error pages: plan-dependent, and do not cover hostnames with no record at all.
- A fallback inside each app: cannot help when the app's own server is down.
- A wildcard DNS record pointing at the website Worker: mixes outage handling into the website and its release cycle.

## Rationale

One small Worker covers typos, retired names and origin outages for the whole zone, with no dependencies to fail. The cost is that every new proxied app must be listed in `src/index.js`, which is documented in [CONFIGURATION.md](../CONFIGURATION.md).

# ADR-0002: Its own repository, separate from the website

<!-- nav -->

<sub><a href="../../README.md">Project README</a> · <a href="../README.md">Documentation index</a></sub>

| Status   | Date       |
| -------- | ---------- |
| Accepted | 2026-11-18 |

## Decision

The maintenance Worker lives in `saadmaz/Team-Sudda-Maintenance`, not in a folder of `saadmaz/Team-Sudda-Website`.

## Alternatives considered

- A `maintenance/` folder inside the website repository, deployed separately.

## Rationale

The Worker covers the whole zone (website, apps and mistyped subdomains), not just the website, and it must keep working when the website is broken. Its own repository gives it its own Workers Builds project, release history and rollback, so a website release can never take the fallback down with it.

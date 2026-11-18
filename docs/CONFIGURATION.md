# Configuration

<!-- nav -->

<sub><a href="../README.md">Project README</a> · <a href="README.md">Documentation index</a></sub>

> Every setting the Worker reads and where it lives. Part of the [project documentation](README.md).

The Worker has **no environment variables and no secrets**. Everything is either a constant in `src/index.js` or a setting in `wrangler.jsonc`.

## `src/index.js`

| Constant            | Purpose                                                                                               |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| `REDIRECTS`         | Hosts that 301 to a canonical host, for example `www` to the apex                                     |
| `SERVICE_HOSTS`     | Hosts that are custom domains of another Worker, mapped to a service binding name in `wrangler.jsonc` |
| `ORIGIN_HOSTS`      | Proxied hosts served by an origin server; passed through with `fetch`                                 |
| `DOWN_STATUSES`     | Upstream statuses treated as "down" and replaced by the maintenance page                              |
| `ORIGIN_TIMEOUT_MS` | How long a pass-through request may take before the maintenance page is shown (25 s)                  |
| `PAGE`              | The maintenance page itself (see [CONTENT.md](CONTENT.md))                                            |

Not every constant exists in every brand's Worker; an unused list is simply absent or empty.

## `wrangler.jsonc`

| Key             | Value                                          | Why                                                                                |
| --------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| `name`          | `team-sudda-maintenance`                       | Must match the Workers Builds project name                                         |
| `routes`        | `*.teamsudda.lk/*` on zone `teamsudda.lk`      | Catches every proxied subdomain                                                    |
| `services`      | Service bindings, when `SERVICE_HOSTS` is used | Lets the route hand a request to the website Worker                                |
| `workers_dev`   | `true`                                         | Keeps a `workers.dev` address for direct testing                                   |
| `preview_urls`  | `false`                                        | Preview URLs add a hidden `*.teamsudda.lk` record that answers 404s; keep them off |
| `observability` | enabled                                        | Logs and metrics in the Cloudflare dashboard                                       |

## Adding a new app on a subdomain

When a new app goes live on a **proxied** subdomain, add it here in the same release, or the route answers it with the maintenance page:

| The app is...                             | Do this                                                                               |
| ----------------------------------------- | ------------------------------------------------------------------------------------- |
| A Worker with a custom domain             | Add the host to `SERVICE_HOSTS` and a matching `services` binding in `wrangler.jsonc` |
| A proxied DNS record pointing at a server | Add the host to `ORIGIN_HOSTS`                                                        |
| A DNS-only record                         | Nothing; it never reaches this Worker                                                 |

Check which path answers a host with:

```sh
curl -sI https://<host>/ | grep -i fallback
```

A `X-Team-Sudda-Fallback` header means this Worker shaped the response.

## GitHub Environments

| Environment  | Variable          | Value                       |
| ------------ | ----------------- | --------------------------- |
| `production` | `APP_URL`         | `https://www.teamsudda.lk/` |
| `production` | `FALLBACK_HEADER` | `X-Team-Sudda-Fallback`     |

The Deploy workflow uses them to confirm the live Worker after each release. `development` exists for parity with other STTPS repositories and has no variables.

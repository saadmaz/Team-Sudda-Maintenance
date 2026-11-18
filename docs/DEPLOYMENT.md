# Deployment

<!-- nav -->

<sub><a href="../README.md">Project README</a> · <a href="README.md">Documentation index</a></sub>

> How `team-sudda-maintenance` reaches production. Part of the [project documentation](README.md).

## Environments

| Environment   | Branch    | Covers             | Deploys                                                                      |
| ------------- | --------- | ------------------ | ---------------------------------------------------------------------------- |
| `development` | `develop` | Nothing live       | Not deployed; built and tested by CI on every merge                          |
| `production`  | `main`    | `*.teamsudda.lk/*` | Automatically when `develop` is promoted to `main` by a release pull request |

A route Worker sits in front of the whole zone, so a second copy cannot run beside it without catching the same traffic. Changes are verified by the tests and the dry-run bundle in CI, then shipped to production by release.

Cloudflare Workers Builds builds and deploys `main`; the [Deploy workflow](../.github/workflows/deploy.yml) waits for that build of the exact commit, fails if it fails, then requests `APP_URL` and checks the response carries `FALLBACK_HEADER`.

### Promotion

1. Feature branches merge into `develop`, where CI verifies them.
2. When ready, open a release pull request from `develop` into `main` (see [runbooks/release.md](runbooks/release.md)).
3. Merging it deploys to production.

## What is already set up

| Item                                                            | Where                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------ |
| Worker name `team-sudda-maintenance`, pinned compatibility date | `wrangler.jsonc`                                       |
| Route `*.teamsudda.lk/*`                                        | `wrangler.jsonc`                                       |
| `workers.dev` address on, preview URLs off                      | `wrangler.jsonc`                                       |
| Logs and metrics                                                | `observability` in `wrangler.jsonc`                    |
| Automatic deploy on every push to `main`                        | Cloudflare Workers Builds (connected in the dashboard) |
| Post-deploy verification                                        | `.github/workflows/deploy.yml`                         |

## Connecting Workers Builds (one time)

Cloudflare builds and deploys straight from this GitHub repository. No API tokens or GitHub secrets are needed.

1. **Give Cloudflare access to the repository.** GitHub → Settings → Applications → **Cloudflare Workers and Pages** → Configure → Repository access: add `saadmaz/Team-Sudda-Maintenance` (skip if it has access to all repositories).
2. **Connect it.** Cloudflare dashboard → **Workers & Pages** → `team-sudda-maintenance` → **Settings** → **Build** → **Connect** → GitHub → `saadmaz/Team-Sudda-Maintenance`.
3. **Use these settings:**

   | Setting                            | Value                   |
   | ---------------------------------- | ----------------------- |
   | Production branch                  | `main`                  |
   | Build command                      | (leave empty)           |
   | Deploy command                     | `npx wrangler deploy`   |
   | Builds for non-production branches | **Off**                 |
   | Root directory                     | `/` (leave empty)       |
   | Build variable                     | `BUN_VERSION` = `1.4.4` |

4. **Save.** From then on every push to `main` deploys automatically.

> [!WARNING]
> Keep non-production branch builds **off**. A route Worker has no preview environment, and `preview_urls` must stay `false` (see [CONFIGURATION.md](CONFIGURATION.md)).

## Deploying from your machine

```sh
npx wrangler login     # once
bun run deploy
```

Use this only in an emergency; a manual deploy is replaced by the next build of `main`.

## Post-deployment checks

```sh
curl -sI https://www.teamsudda.lk/ | grep -iE "^HTTP|fallback"
```

Then re-test every live hostname on teamsudda.lk (main site, `www`, each app) and confirm each still answers as listed in [ARCHITECTURE.md](ARCHITECTURE.md).

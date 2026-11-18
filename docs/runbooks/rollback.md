# Rollback

<!-- nav -->

<sub><a href="../../README.md">Project README</a> · <a href="../README.md">Documentation index</a></sub>

> [!WARNING]
> Use this when a deploy has broken production. Restore service first, then fix the cause.

## Fastest: roll back the Worker

1. Open the Cloudflare dashboard → **Workers & Pages** → `team-sudda-maintenance` → **Deployments**.
2. Find the last good deployment and choose **Rollback**. Traffic switches within seconds.

From a terminal, the same is available with:

```sh
npx wrangler deployments list --name team-sudda-maintenance
npx wrangler rollback <version-id> --name team-sudda-maintenance
```

## Last resort: take the route off

If the Worker itself is the problem and no good version exists, remove the route `*.teamsudda.lk/*` (Worker → Settings → **Domains & Routes**). Proxied subdomains then fall back to Cloudflare's default behaviour until it is restored.

## Then: make `main` match production

A rollback only changes what is served. Revert the bad change on `main` so the next deploy does not reintroduce it:

```sh
git revert <bad-commit-sha>
```

Open the revert as a pull request and merge it once CI passes.

Afterwards, record what happened and the fix in the pull request that resolves the root cause.

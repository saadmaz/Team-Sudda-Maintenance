## Summary

<!-- What does this change, and why? -->

Closes #

## Type of change

- [ ] Feature
- [ ] Fix
- [ ] Host list change (a new, moved or retired subdomain)
- [ ] Maintenance page copy or design
- [ ] Chore, tooling or docs

## Screenshots

<!-- Before / after for any change to the page. Include a phone-width screenshot. -->

## Checklist

- [ ] Checks pass locally: `bun run format:check && bun run test && bun run check`
- [ ] Every live hostname on teamsudda.lk answers as expected after the change (`curl -sI https://<host>/`)
- [ ] New proxied apps are added to the right list in `src/index.js` (see `docs/CONFIGURATION.md`)
- [ ] No secrets, credentials or personal data added
- [ ] `CHANGELOG.md` updated under `Unreleased` for user-facing changes

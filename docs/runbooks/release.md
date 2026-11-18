# Release

<!-- nav -->

<sub><a href="../../README.md">Project README</a> · <a href="../README.md">Documentation index</a></sub>

> [!NOTE]
> Releases follow [Semantic Versioning](https://semver.org) and are recorded in [CHANGELOG.md](../../CHANGELOG.md).

## Steps

1. Confirm `develop` is green in CI.
2. From `develop`, create a branch: `git switch develop && git pull && git switch -c release/vX.Y.Z`.
3. In `CHANGELOG.md`, move the `Unreleased` entries under a new `## [X.Y.Z] - YYYY-MM-DD` heading and update the comparison links at the bottom.
4. Set `version` to `X.Y.Z` in `package.json`. The README release badge updates automatically.
5. Run the checks locally (see [CONTRIBUTING.md](../../CONTRIBUTING.md)).
6. Merge the branch into `develop`, then open a pull request from `develop` into `main` titled `Release vX.Y.Z`. Merging it deploys to production.
7. Tag the merge commit on `main` and push the tag:

   ```sh
   git switch main && git pull
   git tag -a vX.Y.Z -m "vX.Y.Z"
   git push origin vX.Y.Z
   ```

8. Publish the GitHub release with the changelog entry as the notes:

   ```sh
   gh release create vX.Y.Z --title "vX.Y.Z" --notes "<paste the changelog section>"
   ```

9. Run the post-deployment checks in [DEPLOYMENT.md](../DEPLOYMENT.md), re-testing every live hostname.

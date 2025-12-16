# Automation Workflow: Branch → Commit → PR

This document explains an opinionated but practical workflow to automate branch creation, enforce branch names and commit messages, and streamline PR creation.

## Goals

- Make branch names consistent and meaningful
- Enforce Conventional Commits for messages
- Provide helper scripts to reduce friction for contributors
- Offer both local (hook) and CI validation options
- Make PR creation easy (via `gh` or auto PR actions)

## Recommended Branch Naming

Pattern: `<type>/<scope>-<short-desc>`

- type: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`
- scope: package or area (use the same scopes as in commit-message guidelines)
- short-desc: dash-separated, lowercase, concise

Examples:

- `feat/web-antd-add-navbar`
- `fix/request-timeout`
- `chore/project-cleanup`

If change touches many areas, use `project` or `other` as the scope.

## Helper scripts (local)

Create these scripts under `scripts/` and add npm scripts for discoverability.

### `scripts/new-branch.sh`

```bash
#!/usr/bin/env bash
# usage: pnpm run new-branch feat web-antd add-navbar
set -e
if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <type> <scope> <short-desc>"
  exit 1
fi
TYPE=$1
SCOPE=$2
DESC=$3
BRANCH="$TYPE/$SCOPE-$DESC"
# basic validation
if [[ ! $TYPE =~ ^(feat|fix|chore|docs|refactor|test|ci)$ ]]; then
  echo "Invalid type: $TYPE"
  exit 1
fi
echo "Creating branch: $BRANCH"
git checkout -b "$BRANCH"
```

Add to `package.json`:

```json
"scripts": {
  "new-branch": "scripts/new-branch.sh"
}
```

### `scripts/check-branch-name.sh` (for pre-push)

```bash
#!/usr/bin/env bash
branch=$(git rev-parse --abbrev-ref HEAD)
if [[ ! $branch =~ ^(feat|fix|chore|docs|refactor|test|ci)\/[a-z0-9._-]+(-[a-z0-9._-]+)*$ ]]; then
  echo "Invalid branch name: '$branch'"
  echo "Expected: <type>/<scope>-<short-desc> (e.g. feat/web-antd-add-navbar)"
  exit 1
fi
exit 0
```

## Commit message workflow

- Use `commitizen` (or `npx git-cz`) to help write Conventional Commits.
- `commitlint` is already in this repo (via `lefthook` and config); keep using it.

Example packages to add (dev):

```
pnpm add -D commitizen cz-conventional-changelog
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

Add `"commit": "npx git-cz"` to `scripts`.

## Hooks & enforcement

- Add `scripts/check-branch-name.sh` to `lefthook` `pre-push` so pushes are rejected locally if branch names are invalid.

`lefthook.yml` snippet:

```yaml
pre-push:
  commands:
    branch-name-check:
      run: ./scripts/check-branch-name.sh
```

- `commit-msg` hook is already wired to `commitlint`.

## CI checks (optional/recommended)

Add a GitHub Action job to validate branch names (and commit messages) on push. Failing the job prevents merging if branch protection requires passing checks.

Example branch-name validation step:

```yaml
on: [push]
jobs:
  validate-branch:
    runs-on: ubuntu-latest
    steps:
      - name: Validate branch name
        run: |
          branch=${GITHUB_REF#refs/heads/}
          if [[ ! $branch =~ ^(feat|fix|chore|docs|refactor|test|ci)\/[a-z0-9._-]+(-[a-z0-9._-]+)*$ ]]; then
            echo "Invalid branch name: $branch"
            exit 1
          fi
```

## PR creation

- Manual via GitHub CLI:

```bash
# push current branch then run
gh pr create --title "<type>(<scope>): <short subject>" --body "Short description" --base main --head $(git rev-parse --abbrev-ref HEAD) --confirm
```

- Auto PRs: use `peter-evans/create-pull-request` or `actions/create-pull-request` to open PRs automatically on pushes to certain branch patterns.

## Example `package.json` scripts

```json
"scripts": {
  "new-branch": "scripts/new-branch.sh",
  "commit": "git add -A && npx git-cz",
  "push-pr": "git push -u origin $(git rev-parse --abbrev-ref HEAD) && gh pr create --title \"$(git log -1 --pretty=%s)\" --body \"$(git log -1 --pretty=%b)\" --base main --head $(git rev-parse --abbrev-ref HEAD) --confirm"
}
```

## Notes & best practices

- Avoid `--no-verify` except for documented emergency cases.
- Keep branch names short and focused.
- Use `project`/`other` for multi-area work.

---

If you want, I can implement the helper scripts and add the `lefthook` pre-push entry now, or add the CI job. Which enforcement/automation pieces should I add first? (Recommended: add `new-branch.sh`, `check-branch-name.sh`, lefthook entry, and package scripts.)

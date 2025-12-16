# Branch Creation Guidelines

This document defines how branches should be named and created for this repository, plus options to validate or enforce the policy.

## Naming convention (recommended)

Use the pattern:

<type>/<scope>-<short-desc>

- type: one of `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`.
- scope: the package or area affected (use one of the scopes in `project-docs/commit-message-guidelines.md`, or `project`/`other`).
- short-desc: short dash-separated description, lowercase, no trailing punctuation.

Examples:

- `feat/web-antd-add-navbar` (feature in `web-antd`)
- `fix/request-timeout` (bugfix in `request`)
- `chore/project-initial-setup` (repo-wide chore)

If a change touches many areas, use `project` or `other` as the scope.

## Creating branches (recommended helper)

Provide a small helper script to generate valid branch names and create the branch for contributors:

```bash
# usage: pnpm run new-branch <type> <scope> <short-desc>
# example: pnpm run new-branch feat web-antd add-navbar

echo "Creating branch: $1/$2-$3"
branch="$1/$2-$3"
# optional: validate parts here
git checkout -b "$branch"
```

You can add a script to `package.json`:

```json
"scripts": {
  "new-branch": "scripts/new-branch.sh"
}
```

## Local validation (prevent bad pushes)

Add a `lefthook` `pre-push` check that runs a simple script and rejects pushes with invalid branch names.

Example script `scripts/check-branch-name.sh`:

```bash
#!/usr/bin/env bash
branch=$(git rev-parse --abbrev-ref HEAD)
# pattern: type/scope-desc
if [[ ! $branch =~ ^(feat|fix|chore|docs|refactor|test|ci)\/[a-z0-9._-]+(-[a-z0-9._-]+)*$ ]]; then
  echo "Invalid branch name: '$branch'"
  echo "Expected: <type>/<scope>-<short-desc> (e.g. feat/web-antd-add-navbar)"
  exit 1
fi
exit 0
```

Add to `lefthook.yml` under `pre-push`:

```yaml
pre-push:
  commands:
    branch-name-check:
      run: ./scripts/check-branch-name.sh
```

## CI validation

If you prefer not to block pushes locally, add a CI job (GitHub Actions) that fails on invalid branch names. This will prevent merges until the branch is renamed or a fix is made.

Example GitHub Action snippet:

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

## Server-side enforcement

If you control the Git server, add a `pre-receive` hook that rejects bad branch names. On GitHub/hosted providers, use CI+branch protection rules to require checks pass before merging.

## Policy notes

- Keep branch names short and descriptive rather than deeply nested.
- Use `project` or `other` when a change spans multiple packages.
- Avoid `--no-verify` except for emergency bypasses with a documented reason.

## Resources

- See `project-docs/commit-message-guidelines.md` for related commit message scope rules and examples.

---

If you want, I can:

- Add the helper scripts and lefthook pre-push entry, or
- Add a GitHub Action that validates branch names.

Which enforcement option should I implement (local hook, CI check, helper scripts, or none)?

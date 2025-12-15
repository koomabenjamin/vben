# Commit Message Guidelines

This document describes how to write git commit messages for this project.

## Format

Use Conventional Commits:

<type>(<scope>): <short subject>

- `type`: one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`, `revert`.
- `scope`: optional, choose one of the project's allowed scopes (see below).
- `subject`: short, imperative, lowercase, no trailing period.

Examples:

- `chore(project): initial commit`
- `feat(@vben/web-antd): add new layout component`
- `fix(@vben/request): handle timeout correctly`

## Allowed scopes

Use one of the following scopes when applicable:

`@vben/backend-mock`, `@vben/web-antd`, `@vben/web-ele`, `@vben/web-naive`, `@vben/web-tdesign`, `@vben/docs`, `@vben/commitlint-config`, `@vben/eslint-config`, `@vben/prettier-config`, `@vben/stylelint-config`, `@vben/node-utils`, `@vben/tailwind-config`, `@vben/tsconfig`, `@vben/vite-config`, `@vben-core/design`, `@vben-core/icons`, `@vben-core/shared`, `@vben-core/typings`, `@vben-core/composables`, `@vben-core/preferences`, `@vben-core/form-ui`, `@vben-core/layout-ui`, `@vben-core/menu-ui`, `@vben-core/popup-ui`, `@vben-core/shadcn-ui`, `@vben-core/tabs-ui`, `@vben/constants`, `@vben/access`, `@vben/common-ui`, `@vben/hooks`, `@vben/layouts`, `@vben/plugins`, `@vben/request`, `@vben/icons`, `@vben/locales`, `@vben/preferences`, `@vben/stores`, `@vben/styles`, `@vben/types`, `@vben/utils`, `@vben/playground`, `@vben/turbo-run`, `@vben/vsh`, `project`, `style`, `lint`, `ci`, `dev`, `deploy`, `other`

If your change affects multiple areas, use `project` or `other` as the scope.

## Validation and tooling

- This repository uses `commitlint` with a ruleset that enforces Conventional Commits and the allowed scope enum.
- A commit-msg hook runs `pnpm exec commitlint --edit $1` via `lefthook`.
- To check a message locally before committing:

```bash
pnpm exec commitlint --from=HEAD~1 --to=HEAD
# or for a single message file
pnpm exec commitlint --edit <path-to-commit-msg-file>
```

## Fixing a rejected commit message

If your commit is rejected by commitlint, amend the message locally and recommit:

```bash
git commit --amend -m "<type>(<scope>): <message>"
```

If you accidentally bypassed the hook and need to re-run the check manually:

```bash
pnpm exec commitlint --edit .git/COMMIT_EDITMSG
```

Avoid using `--no-verify` unless absolutely necessary.

## Initial commit suggestions

- Repo-wide: `chore(project): initial commit`
- Package-specific: `chore(@vben/web-antd): initial commit`

## Resources

- Conventional Commits: https://www.conventionalcommits.org/
- Commitlint: https://commitlint.js.org/

---

Questions or suggested improvements: open an issue or create a PR against `project-docs/README.md`.
